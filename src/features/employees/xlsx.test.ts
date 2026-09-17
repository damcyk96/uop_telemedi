import { describe, expect, it } from 'vitest'
import * as XLSX from 'xlsx'
import { pl } from '@/i18n/locales/pl'
import { parseEmployees } from './xlsx'

function workbookFile(rows: string[][]): File {
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(rows), 'Pracownicy')
  const data = XLSX.write(book, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  return { arrayBuffer: async () => data } as File
}

describe('import pracowników z XLSX', () => {
  it('pomija niezmieniony przykładowy wiersz i importuje dane wpisane poniżej', async () => {
    const file = workbookFile([
      ['instrukcje'],
      ['Imię', 'Nazwisko', 'PESEL'],
      ['Jan', 'Przykładowy', '90010112349', '', '', '', 'ul. Testowa 1', '00-001', 'Warszawa', '500 000 000', 'jan@example.com', 'Specjalista'],
      ['Ewa', 'Testowa', '99010112342', '', '', '', 'ul. Nowa 2', '00-002', 'Warszawa', '', '', 'Księgowa'],
    ])

    const result = await parseEmployees(file, pl.employees.xlsx)

    expect(result.issues).toEqual([])
    expect(result.valid).toHaveLength(1)
    expect(result.valid[0]).toMatchObject({ firstName: 'Ewa', lastName: 'Testowa', pesel: '99010112342' })
  })

  it('zgłasza wiersz bez wymaganych danych zamiast go importować', async () => {
    const file = workbookFile([
      ['instrukcje'],
      ['nagłówki'],
      ['Ewa', 'Testowa', '99010112342'],
    ])

    const result = await parseEmployees(file, pl.employees.xlsx)

    expect(result.valid).toEqual([])
    expect(result.issues).toEqual([{ row: 3, reasonKey: 'validation.employee.streetRequired' }])
  })
})
