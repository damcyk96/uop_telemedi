import type { ID } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function deleteEmployee(id: ID) {
  return apiClient<void>({ method: HttpMethod.DELETE, path: `/employees/${id}` })
}
