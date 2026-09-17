import type { User } from '@/domain/types'
import { apiClient, HttpMethod } from './client'

export function postUser(user: User) {
  return apiClient<User>({ method: HttpMethod.POST, path: '/users', body: user })
}
