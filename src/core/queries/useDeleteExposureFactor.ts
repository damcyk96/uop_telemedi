import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeExposureFactor } from '@/domain/exposureCatalog'
import type { ExposureFactor } from '@/domain/types'
import { deleteExposureFactor, getReferralTemplates, putReferralTemplate } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

type Result = Awaited<ReturnType<typeof removeExposureFactor>>

export function useDeleteExposureFactor(options?: MutationOptions<Result, ExposureFactor>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (factor: ExposureFactor) => {
      const templates = await queryClient.ensureQueryData({
        queryKey: queryKeys.referralTemplates,
        queryFn: getReferralTemplates,
      })
      return removeExposureFactor(factor, templates, {
        replaceTemplate: putReferralTemplate,
        removeFactor: deleteExposureFactor,
      })
    },
    onSettled: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.exposureFactors }),
        queryClient.invalidateQueries({ queryKey: queryKeys.referralTemplates }),
      ])
      await options?.onSettled?.(...args)
    },
  })
}
