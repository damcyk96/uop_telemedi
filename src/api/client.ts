const base = '/api'
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`Błąd API (${response.status})`)
  return response.json()
}
export const get = <T,>(resource: string) => api<T>(`/${resource}`)
export const create = <T,>(resource: string, data: unknown) => api<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(data) })
export const update = <T,>(resource: string, id: string, data: unknown) => api<T>(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const remove = (resource: string, id: string) => api<unknown>(`/${resource}/${id}`, { method: 'DELETE' })
