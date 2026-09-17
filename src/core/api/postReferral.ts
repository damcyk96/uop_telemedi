import type { Referral } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function postReferral(referral: Referral) {
  return apiClient<Referral>({ method: HttpMethod.POST, path: '/referrals', body: referral })
}
