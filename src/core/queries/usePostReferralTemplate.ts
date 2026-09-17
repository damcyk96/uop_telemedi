import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReferralTemplate } from '@/domain/types'
import { postReferralTemplate } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function usePostReferralTemplate(options?: MutationOptions<ReferralTemplate, ReferralTemplate>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: postReferralTemplate,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.referralTemplates })
      await options?.onSuccess?.(...args)
    },
  })
}
