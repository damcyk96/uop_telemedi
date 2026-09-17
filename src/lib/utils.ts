export function uid() {
  return crypto.randomUUID()
}

export function datePL(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }
  return new Intl.DateTimeFormat('pl-PL').format(date)
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
