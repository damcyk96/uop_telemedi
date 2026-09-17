import type { Employee } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function getEmployees() {
  return apiClient<Employee[]>({ method: HttpMethod.GET, path: '/employees' })
}
