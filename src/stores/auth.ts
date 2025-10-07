import { defineStore } from 'pinia'
import { useDynDNS } from '@/stores/dyndns'
import { login as loginRequest } from '@/api/auth'
import type { Auth, AuthToken } from '@/types/auth'

const TOKEN_STORAGE_KEY = 'dyndns_token'

function loadToken(): AuthToken | null {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as AuthToken
  } catch {
    return null
  }
}

function saveToken(data: AuthToken | null) {
  if (data) {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

const initialToken = loadToken()

export const useAuth = defineStore('auth', {
  state: () => ({
    token: initialToken?.token ?? '',
    tokenType: initialToken?.tokenType ?? 'Bearer',
    expiresAt: initialToken?.expiresAt ?? '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    setAuth(data: AuthToken | null) {
      if (data) {
        this.token = data.token
        this.tokenType = data.tokenType
        this.expiresAt = data.expiresAt
      } else {
        this.token = ''
        this.tokenType = 'Bearer'
        this.expiresAt = ''
      }
      saveToken(data)
    },
    async login(credentials: Auth) {
      const response = await loginRequest(credentials)
      this.setAuth({
        token: response.token,
        tokenType: response.tokenType || 'Bearer',
        expiresAt: response.expiresAt,
      })
      return response
    },
    logout() {
      this.setAuth(null)
      const dyndns = useDynDNS()
      dyndns.$reset()
    },
  },
})

export type { Auth as Credentials, AuthToken as LoginResponse }
