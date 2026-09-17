const API_BASE_URL = '/api'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface ApiRequest {
  method: HttpMethod
  path: string
  body?: unknown
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly method: HttpMethod,
    readonly path: string,
  ) {
    super(`API request failed with ${status} (${method} ${path})`)
    this.name = 'ApiError'
  }
}

export async function apiClient<TResponse>({ method, path, body }: ApiRequest): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new ApiError(response.status, method, path)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}
