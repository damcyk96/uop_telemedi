import type { User } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function getUsers() {
  return apiClient<User[]>({ method: HttpMethod.GET, path: '/users' })
}
