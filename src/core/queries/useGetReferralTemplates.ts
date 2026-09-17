import { useQuery } from '@tanstack/react-query'
import type { ReferralTemplate } from '@/domain/types'
import { getReferralTemplates } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

export function useGetReferralTemplates(options?: QueryOptions<ReferralTemplate[]>) {
  return useQuery({ queryKey: queryKeys.referralTemplates, queryFn: getReferralTemplates, ...options })
}
