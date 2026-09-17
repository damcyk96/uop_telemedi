import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ExposureFactor } from '@/domain/types'
import { postExposureFactor } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function usePostExposureFactor(options?: MutationOptions<ExposureFactor, ExposureFactor>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: postExposureFactor,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.exposureFactors })
      await options?.onSuccess?.(...args)
    },
  })
}
