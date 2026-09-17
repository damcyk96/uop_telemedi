import type { ReferralTemplate } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function postReferralTemplate(template: ReferralTemplate) {
  return apiClient<ReferralTemplate>({ method: HttpMethod.POST, path: '/templates', body: template })
}
