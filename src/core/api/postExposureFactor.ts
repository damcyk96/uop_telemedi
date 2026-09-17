import type { ExposureFactor } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function postExposureFactor(factor: ExposureFactor) {
  return apiClient<ExposureFactor>({ method: HttpMethod.POST, path: '/factors', body: factor })
}
