import type { ExposureFactor } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function getExposureFactors() {
  return apiClient<ExposureFactor[]>({ method: HttpMethod.GET, path: '/factors' })
}
