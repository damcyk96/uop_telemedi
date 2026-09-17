import type { ReferralTemplate } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function putReferralTemplate(template: ReferralTemplate) {
  return apiClient<ReferralTemplate>({ method: HttpMethod.PUT, path: `/templates/${template.id}`, body: template })
}
