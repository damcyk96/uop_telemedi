import { BriefcaseMedical, Pencil, Trash2, Users } from 'lucide-react'
import type { Employee } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { IconButton } from '@/ui/atoms'
import { PersonCell } from '@/ui/molecules'
import { DataTable, type DataTableColumn } from '@/ui/organisms'

export interface EmployeesTableProps {
  employees: Employee[]
  loading: boolean
  onIssueReferral: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onRemove: (employee: Employee) => void
}

export function EmployeesTable({ employees, loading, onIssueReferral, onEdit, onRemove }: EmployeesTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn[] = [
    { header: t('employees.table.columns.employee') },
    { header: t('employees.table.columns.identity') },
    { header: t('employees.table.columns.position') },
    { header: t('employees.table.columns.city') },
    { header: t('employees.table.columns.phone') },
    { header: t('employees.table.columns.actions'), align: 'right' },
  ]

  function renderEmployee(employee: Employee) {
    const name = `${employee.firstName} ${employee.lastName}`

    return (
      <tr key={employee.id}>
        <td>
          <PersonCell
            firstName={employee.firstName}
            lastName={employee.lastName}
            subtitle={employee.email || t('employees.table.noEmail')}
          />
        </td>
        <td className="mono">{employee.pesel || employee.documentNumber}</td>
        <td>{employee.position}</td>
        <td>{employee.address.city}</td>
        <td>{employee.phone || t('common.emptyValue')}</td>
        <td>
          <div className="row-actions">
            <IconButton
              icon={BriefcaseMedical}
              label={t('employees.table.issueReferralLabel', { name })}
              title={t('employees.table.issueReferral')}
              onClick={() => onIssueReferral(employee)}
            />
            <IconButton
              icon={Pencil}
              label={t('employees.table.editLabel', { name })}
              title={t('common.edit')}
              onClick={() => onEdit(employee)}
            />
            <IconButton
              icon={Trash2}
              tone="danger"
              label={t('employees.table.removeLabel', { name })}
              title={t('common.remove')}
              onClick={() => onRemove(employee)}
            />
          </div>
        </td>
      </tr>
    )
  }

  return (
    <DataTable
      label={t('employees.table.label')}
      caption={t('employees.table.caption')}
      columns={columns}
      rows={employees}
      loading={loading}
      empty={{ icon: Users, title: t('employees.table.emptyTitle'), text: t('employees.table.emptyText') }}
      renderRow={renderEmployee}
    />
  )
}
