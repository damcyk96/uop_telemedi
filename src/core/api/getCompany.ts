import type { Company } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function getCompany() {
  return apiClient<Company>({ method: HttpMethod.GET, path: '/company' })
}
