import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReferralTemplate } from '@/domain/types'
import { putReferralTemplate } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function usePutReferralTemplate(options?: MutationOptions<ReferralTemplate, ReferralTemplate>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: putReferralTemplate,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.referralTemplates })
      await options?.onSuccess?.(...args)
    },
  })
}
