import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ID } from '@/domain/types'
import { deleteReferralTemplate } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function useDeleteReferralTemplate(options?: MutationOptions<void, ID>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: deleteReferralTemplate,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.referralTemplates })
      await options?.onSuccess?.(...args)
    },
  })
}
