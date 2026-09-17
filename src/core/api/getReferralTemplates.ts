import type { ReferralTemplate } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function getReferralTemplates() {
  return apiClient<ReferralTemplate[]>({ method: HttpMethod.GET, path: '/templates' })
}
