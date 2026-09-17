import { useMutation, useQueryClient } from '@tanstack/react-query'
import { prependReferral } from '@/core/queries'
import { createReferralIssuance } from './ReferralIssuance'
import { JsonServerReferralIssuanceAdapter } from './JsonServerReferralIssuanceAdapter'

const issuance = createReferralIssuance({ persistence: new JsonServerReferralIssuanceAdapter() })

export function useReferralIssuance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: issuance.issue,
    onSuccess: referral => prependReferral(queryClient, referral),
  })
}
