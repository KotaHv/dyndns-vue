import request from '@/utils/request'
import type { Auth, AuthToken, RefreshRequest } from '@/types/auth'

export async function login(payload: Auth): Promise<AuthToken> {
  return request.post('auth/login', { json: payload }).json<AuthToken>()
}

export async function refresh(payload: RefreshRequest): Promise<AuthToken> {
  return request.post('auth/refresh', { json: payload }).json<AuthToken>()
}

export async function logout(payload: RefreshRequest): Promise<void> {
  await request.post('auth/logout', { json: payload })
}
