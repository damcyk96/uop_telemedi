import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '@/domain/types'
import { postUser } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

export function usePostUser(options?: MutationOptions<User, User>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: postUser,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users })
      await options?.onSuccess?.(...args)
    },
  })
}
