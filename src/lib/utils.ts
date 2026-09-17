export function uid() {
  return crypto.randomUUID()
}

export function datePL(value: string) {
  return new Intl.DateTimeFormat('pl-PL').format(new Date(value))
}

function normalizeLogin(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9.]/g, '')
}

export function nextLogin(firstName: string, lastName: string, existing: string[]) {
  const base = normalizeLogin(`${firstName}.${lastName}`)
  let login = base
  let suffix = 2
  while (existing.includes(login)) {
    login = `${base}${suffix}`
    suffix += 1
  }
  return login
}
