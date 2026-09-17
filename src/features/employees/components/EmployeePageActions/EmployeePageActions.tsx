import { useRef } from 'react'
import { Download, FileSpreadsheet, Plus, Upload } from 'lucide-react'
import type { Employee } from '@/domain/types'
import { downloadTemplate, exportEmployees } from '@/features/employees/xlsx'
import { useTranslation } from '@/i18n'
import { Button } from '@/ui/atoms'

export interface EmployeePageActionsProps {
  employees: Employee[]
  onImport: (file?: File) => Promise<void>
  onCreate: () => void
}

export function EmployeePageActions({ employees, onImport, onCreate }: EmployeePageActionsProps) {
  const { t, translations } = useTranslation()
  const fileInput = useRef<HTMLInputElement>(null)
  const sheetTexts = translations.employees.xlsx

  async function handleImport(file?: File) {
    await onImport(file)
    if (fileInput.current) {
      fileInput.current.value = ''
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => void downloadTemplate(sheetTexts)}>
        <FileSpreadsheet size={17} aria-hidden="true" />
        {t('employees.actions.downloadTemplate')}
      </Button>
      <input
        ref={fileInput}
        hidden
        type="file"
        accept=".xlsx,.xls"
        onChange={event => void handleImport(event.target.files?.[0])}
      />
      <Button variant="ghost" onClick={() => fileInput.current?.click()}>
        <Upload size={17} aria-hidden="true" />
        {t('employees.actions.import')}
      </Button>
      <Button variant="ghost" onClick={() => void exportEmployees(employees, sheetTexts)}>
        <Download size={17} aria-hidden="true" />
        {t('employees.actions.export')}
      </Button>
      <Button onClick={onCreate}>
        <Plus size={17} aria-hidden="true" />
        {t('employees.actions.create')}
      </Button>
    </>
  )
}
