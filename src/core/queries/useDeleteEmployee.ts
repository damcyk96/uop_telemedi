import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ID } from '@/domain/types'
import { deleteEmployee } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function useDeleteEmployee(options?: MutationOptions<void, ID>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: deleteEmployee,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees })
      await options?.onSuccess?.(...args)
    },
  })
}
