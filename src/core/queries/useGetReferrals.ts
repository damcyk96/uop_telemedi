import { useQuery } from '@tanstack/react-query'
import type { Referral } from '@/domain/types'
import { getReferrals } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

export function useGetReferrals(options?: QueryOptions<Referral[]>) {
  return useQuery({ queryKey: queryKeys.referrals, queryFn: getReferrals, ...options })
}
