import type { Employee } from '@/domain/types'
import { prepareEmployee, type EmployeeDraft } from '@/domain/employees'
import type { TranslationKey, Translations } from '@/i18n/types'
import { uid } from '@/lib/utils'

export type EmployeeSheetTexts = Translations['employees']['xlsx']

export interface EmployeeImportIssue {
  row?: number
  employeeName?: string
  reasonKey: TranslationKey
}

const columns = [
  'firstName',
  'lastName',
  'pesel',
  'documentType',
  'documentNumber',
  'birthDate',
  'street',
  'postalCode',
  'city',
  'phone',
  'email',
  'position',
] as const satisfies ReadonlyArray<keyof EmployeeSheetTexts['columns']>

const wideColumns = new Set<(typeof columns)[number]>(['street', 'position'])
const HEADER_ROWS = 2

function employeeRow(employee: Employee) {
  return [
    employee.firstName,
    employee.lastName,
    employee.pesel || '',
    employee.documentType || '',
    employee.documentNumber || '',
    employee.birthDate || '',
    employee.address.street,
    employee.address.postalCode,
    employee.address.city,
    employee.phone || '',
    employee.email || '',
    employee.position,
  ]
}

function rowToDraft(row: string[]): EmployeeDraft {
  return {
    firstName: row[0],
    lastName: row[1],
    hasPesel: Boolean(row[2]),
    pesel: row[2] || undefined,
    documentType: (row[3] || undefined) as Employee['documentType'],
    documentNumber: row[4] || undefined,
    birthDate: row[5] || undefined,
    address: { street: row[6], postalCode: row[7], city: row[8] },
    phone: row[9] || undefined,
    email: row[10] || undefined,
    position: row[11],
  }
}

function sheetHeader(texts: EmployeeSheetTexts) {
  return [
    columns.map(column => texts.hints[column]),
    columns.map(column => texts.columns[column]),
  ]
}

function isExampleRow(row: string[], texts: EmployeeSheetTexts) {
  return row[0] === texts.example.firstName && row[1] === texts.example.lastName && row[2] === texts.example.pesel
}

async function save(rows: unknown[][], filename: string, texts: EmployeeSheetTexts) {
  const XLSX = await import('xlsx')
  const sheet = XLSX.utils.aoa_to_sheet(rows)
  sheet['!cols'] = columns.map(column => ({ wch: wideColumns.has(column) ? 28 : 19 }))
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, texts.sheetName)
  XLSX.writeFile(book, filename)
}

export function downloadTemplate(texts: EmployeeSheetTexts) {
  const exampleRow = columns.map(column => texts.example[column])
  return save([...sheetHeader(texts), exampleRow], texts.templateFileName, texts)
}

export function exportEmployees(employees: Employee[], texts: EmployeeSheetTexts) {
  return save([...sheetHeader(texts), ...employees.map(employeeRow)], texts.exportFileName, texts)
}

export async function parseEmployees(file: File, texts: EmployeeSheetTexts): Promise<{ valid: Employee[]; issues: EmployeeImportIssue[] }> {
  const XLSX = await import('xlsx')
  const book = XLSX.read(await file.arrayBuffer(), { type: 'array' })
  const rows = XLSX.utils
    .sheet_to_json<unknown[]>(book.Sheets[book.SheetNames[0]], { header: 1, defval: '' })
    .slice(HEADER_ROWS)
  const valid: Employee[] = []
  const issues: EmployeeImportIssue[] = []

  rows.forEach((rawRow, index) => {
    const row = rawRow.map(String)
    if (!row.some(Boolean) || isExampleRow(row, texts)) {
      return
    }
    const prepared = prepareEmployee(rowToDraft(row), [])
    if (!prepared.ok) {
      issues.push({ row: index + HEADER_ROWS + 1, reasonKey: prepared.errors[0] })
      return
    }
    valid.push({ id: uid(), ...prepared.value })
  })

  return { valid, issues }
}

export async function importEmployees(
  file: File,
  existingEmployees: Employee[],
  saveEmployee: (employee: Employee) => Promise<unknown>,
  texts: EmployeeSheetTexts,
) {
  const parsed = await parseEmployees(file, texts)
  const knownPesels = new Set(existingEmployees.map(employee => employee.pesel).filter(Boolean))
  const issues = [...parsed.issues]
  let added = 0

  for (const employee of parsed.valid) {
    const employeeName = `${employee.firstName} ${employee.lastName}`
    if (employee.pesel && knownPesels.has(employee.pesel)) {
      issues.push({ employeeName, reasonKey: 'employees.import.peselExists' })
      continue
    }
    try {
      await saveEmployee(employee)
      if (employee.pesel) {
        knownPesels.add(employee.pesel)
      }
      added += 1
    } catch {
      issues.push({ employeeName, reasonKey: 'employees.import.saveFailed' })
    }
  }

  return { added, skipped: issues.length, issues }
}
