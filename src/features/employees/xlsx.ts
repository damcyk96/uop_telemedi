import * as XLSX from 'xlsx'
import type { Employee } from '../../domain/types'
import { uid } from '../../lib/utils'

const headers = ['Imię','Nazwisko','PESEL','Rodzaj dokumentu','Numer dokumentu','Data urodzenia','Ulica i nr','Kod pocztowy','Miejscowość','Telefon','E-mail','Stanowisko']
const instruction = ['Wymagane','Wymagane','11 cyfr; puste przy dokumencie','passport / id_card / residence_card / other','Wymagane przy braku PESEL','RRRR-MM-DD','Wymagane','Format 00-000','Wymagane','Opcjonalne','Opcjonalne','Wymagane']
const example = ['Jan','Przykładowy','90010112349','','','','ul. Testowa 1','00-001','Warszawa','500 000 000','jan@example.com','Specjalista']
const employeeRow = (e: Employee) => [e.firstName,e.lastName,e.pesel||'',e.documentType||'',e.documentNumber||'',e.birthDate||'',e.address.street,e.address.postalCode,e.address.city,e.phone||'',e.email||'',e.position]
function save(rows: unknown[][], filename: string) { const sheet = XLSX.utils.aoa_to_sheet(rows); sheet['!cols'] = headers.map((_,i) => ({wch: i === 6 || i === 11 ? 28 : 19})); const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book,sheet,'Pracownicy'); XLSX.writeFile(book,filename) }
export const downloadTemplate = () => save([instruction,headers,example],'pracownicy_wzor.xlsx')
export const exportEmployees = (employees: Employee[]) => save([instruction,headers,...employees.map(employeeRow)],'pracownicy.xlsx')
export async function parseEmployees(file: File): Promise<{valid: Employee[]; errors: string[]}> {
  const book = XLSX.read(await file.arrayBuffer(), {type:'array'}); const rows = XLSX.utils.sheet_to_json<unknown[]>(book.Sheets[book.SheetNames[0]], {header:1, defval:''}).slice(2)
  const valid: Employee[] = []; const errors: string[] = []
  rows.forEach((raw, index) => { const r = raw.map(String); if (!r.some(Boolean)) return; if (r[0] === example[0] && r[1] === example[1] && r[2] === example[2]) return
    if (!r[0] || !r[1] || !r[6] || !r[7] || !r[8] || !r[11]) { errors.push(`wiersz ${index+3}: brak wymaganych danych`); return }
    const hasPesel = Boolean(r[2]); if (!hasPesel && (!r[3] || !r[4] || !r[5])) { errors.push(`wiersz ${index+3}: brak PESEL lub dokumentu`); return }
    valid.push({ id: uid(), firstName:r[0], lastName:r[1], hasPesel, pesel:r[2]||undefined, documentType:(r[3]||undefined) as Employee['documentType'], documentNumber:r[4]||undefined, birthDate:r[5]||undefined, address:{street:r[6],postalCode:r[7],city:r[8]}, phone:r[9]||undefined,email:r[10]||undefined,position:r[11] })
  }); return {valid,errors}
}
