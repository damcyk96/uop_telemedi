import type { Referral } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function getReferrals() {
  return apiClient<Referral[]>({ method: HttpMethod.GET, path: '/referrals?_sort=createdAt&_order=desc' })
}
