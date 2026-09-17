import { useQuery } from '@tanstack/react-query'
import type { Company } from '@/domain/types'
import { getCompany } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

export function useGetCompany(options?: QueryOptions<Company>) {
  return useQuery({ queryKey: queryKeys.company, queryFn: getCompany, ...options })
}
