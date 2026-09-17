import { useQuery } from '@tanstack/react-query'
import type { ExposureFactor } from '@/domain/types'
import { getExposureFactors } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

export function useGetExposureFactors(options?: QueryOptions<ExposureFactor[]>) {
  return useQuery({ queryKey: queryKeys.exposureFactors, queryFn: getExposureFactors, ...options })
}
