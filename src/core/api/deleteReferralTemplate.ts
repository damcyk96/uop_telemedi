import type { ID } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function deleteReferralTemplate(id: ID) {
  return apiClient<void>({ method: HttpMethod.DELETE, path: `/templates/${id}` })
}
