import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Employee } from '@/domain/types'
import { putEmployee } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function usePutEmployee(options?: MutationOptions<Employee, Employee>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: putEmployee,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees })
      await options?.onSuccess?.(...args)
    },
  })
}
