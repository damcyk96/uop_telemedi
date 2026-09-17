import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Employee } from '@/domain/types'
import { useDeleteEmployee, useGetEmployees, usePostEmployee, usePutEmployee } from '@/core/queries'
import { SearchField, Toast } from '@/ui/molecules'
import { PageHeader } from '@/ui/organisms'
import { EmployeeDialog } from '@/features/employees/components/EmployeeDialog'
import { EmployeePageActions } from '@/features/employees/components/EmployeePageActions'
import { EmployeesTable } from '@/features/employees/components/EmployeesTable'
import { useImportEmployees } from '@/features/employees/hooks/useImportEmployees'
import type { EmployeeImportIssue } from '@/features/employees/xlsx'
import { useTranslation } from '@/i18n'

export default function EmployeesPage() {
  const { t } = useTranslation()
  const employeesQuery = useGetEmployees()
  const postEmployee = usePostEmployee()
  const putEmployee = usePutEmployee()
  const deleteEmployee = useDeleteEmployee()
  const importEmployees = useImportEmployees()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Employee | null | undefined>()
  const [toast, setToast] = useState('')
  const employees = employeesQuery.data || []
  const normalizedSearch = search.toLowerCase()
  const filtered = employees.filter(employee => {
    const searchable = `${employee.firstName} ${employee.lastName} ${employee.pesel || employee.documentNumber || ''} ${employee.position} ${employee.address.city}`
    return searchable.toLowerCase().includes(normalizedSearch)
  })

  function describeIssue(issue: EmployeeImportIssue) {
    const reason = t(issue.reasonKey)
    if (issue.row !== undefined) {
      return t('employees.import.rowIssue', { row: issue.row, reason })
    }
    return t('employees.import.employeeIssue', { name: issue.employeeName ?? '', reason })
  }

  async function importFile(file?: File) {
    if (!file) {
      return
    }
    try {
      const result = await importEmployees.mutateAsync(file)
      const [firstIssue] = result.issues
      const counts = { added: result.added, skipped: result.skipped }
      setToast(firstIssue
        ? t('employees.import.summaryWithIssue', { ...counts, issue: describeIssue(firstIssue) })
        : t('employees.import.summary', counts))
    } catch {
      setToast(t('employees.import.readFailed'))
    }
  }

  async function saveEmployee(employee: Employee) {
    if (editing) {
      await putEmployee.mutateAsync(employee)
    } else {
      await postEmployee.mutateAsync(employee)
    }
    setEditing(undefined)
    setToast(t(editing ? 'employees.page.updated' : 'employees.page.created'))
  }

  function removeEmployee(employee: Employee) {
    if (confirm(t('employees.page.removeConfirm', { name: `${employee.firstName} ${employee.lastName}` }))) {
      deleteEmployee.mutate(employee.id)
    }
  }

  const actions = (
    <EmployeePageActions
      employees={employees}
      onImport={importFile}
      onCreate={() => setEditing(null)}
    />
  )

  return (
    <>
      <PageHeader
        eyebrow={t('employees.page.eyebrow')}
        title={t('employees.page.title')}
        description={t('employees.page.description')}
        actions={actions}
      />
      <div className="toolbar">
        <SearchField
          label={t('employees.page.searchLabel')}
          placeholder={t('employees.page.searchPlaceholder')}
          value={search}
          onValueChange={setSearch}
        />
        <span className="result-count" aria-live="polite">
          {t('employees.page.resultCount', { count: filtered.length })}
        </span>
      </div>
      <EmployeesTable
        employees={filtered}
        loading={employeesQuery.isLoading}
        onIssueReferral={employee => navigate(`/skierowania/nowe?employeeId=${employee.id}`)}
        onEdit={setEditing}
        onRemove={removeEmployee}
      />
      {editing !== undefined && (
        <EmployeeDialog
          employee={editing}
          employees={employees}
          onClose={() => setEditing(undefined)}
          onSave={saveEmployee}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </>
  )
}
