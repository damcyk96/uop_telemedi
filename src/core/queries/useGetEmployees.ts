import { useQuery } from '@tanstack/react-query'
import type { Employee } from '@/domain/types'
import { getEmployees } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

export function useGetEmployees(options?: QueryOptions<Employee[]>) {
  return useQuery({ queryKey: queryKeys.employees, queryFn: getEmployees, ...options })
}
