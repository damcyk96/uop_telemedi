import type { Employee } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function postEmployee(employee: Employee) {
  return apiClient<Employee>({ method: HttpMethod.POST, path: '/employees', body: employee })
}
