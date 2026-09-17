import type { ID } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function deleteExposureFactor(id: ID) {
  return apiClient<void>({ method: HttpMethod.DELETE, path: `/factors/${id}` })
}
