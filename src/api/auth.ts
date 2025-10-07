import request from '@/utils/request'
import type { Auth, AuthToken } from '@/types/auth'

export async function login(payload: Auth): Promise<AuthToken> {
  return request.post('auth/login', { json: payload }).json<AuthToken>()
}
