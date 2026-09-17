import { useQuery } from '@tanstack/react-query'
import type { User } from '@/domain/types'
import { getUsers } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

export function useGetUsers(options?: QueryOptions<User[]>) {
  return useQuery({ queryKey: queryKeys.users, queryFn: getUsers, ...options })
}
