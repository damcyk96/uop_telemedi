import type { Employee } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function putEmployee(employee: Employee) {
  return apiClient<Employee>({ method: HttpMethod.PUT, path: `/employees/${employee.id}`, body: employee })
}
