import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Employee } from '@/domain/types'
import { postEmployee } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function usePostEmployee(options?: MutationOptions<Employee, Employee>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: postEmployee,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees })
      await options?.onSuccess?.(...args)
    },
  })
}
