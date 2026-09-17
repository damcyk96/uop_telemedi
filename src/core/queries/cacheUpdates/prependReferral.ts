import type { QueryClient } from '@tanstack/react-query'
import type { Referral } from '@/domain/types'
import { queryKeys } from '@/core/queries/queryKeys'

export function prependReferral(queryClient: QueryClient, referral: Referral) {
  queryClient.setQueryData<Referral[]>(queryKeys.referrals, current => [
    referral,
    ...(current ?? []).filter(item => item.id !== referral.id),
  ])
}
