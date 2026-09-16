export const uid = () => crypto.randomUUID()
export const datePL = (value: string) => new Intl.DateTimeFormat('pl-PL').format(new Date(value))
export const normalizeLogin = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9.]/g, '')
export function nextLogin(firstName: string, lastName: string, existing: string[]) {
  const base = normalizeLogin(`${firstName}.${lastName}`); let login = base; let i = 2
  while (existing.includes(login)) login = `${base}${i++}`
  return login
}
export const nextReferralNumber = (existingNumbers: string[]) => {
  const highest = existingNumbers.reduce((max, number) => {
    const suffix = Number(number.split('/').pop())
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max
  }, 0)
  const d = new Date(); return `SK/${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(highest+1).padStart(4,'0')}`
}
