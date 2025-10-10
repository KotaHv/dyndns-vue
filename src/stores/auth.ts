import { defineStore } from 'pinia'
import { useDynDNS } from '@/stores/dyndns'
import { login as loginRequest, refresh as refreshRequest, logout as logoutRequest } from '@/api/auth'
import type { Auth, AuthToken, RefreshRequest } from '@/types/auth'

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

let refreshPromise: Promise<AuthToken> | null = null

function buildRefreshPayload(refreshToken: string): RefreshRequest {
  return { refreshToken }
}

export const useAuth = defineStore('auth', {
  state: () => ({
    token: initialToken?.token ?? '',
    tokenType: initialToken?.tokenType ?? 'Bearer',
    expiresAt: initialToken?.expiresAt ?? '',
    refreshToken: initialToken?.refreshToken ?? '',
    refreshExpiresAt: initialToken?.refreshExpiresAt ?? '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    canRefresh: (state) => Boolean(state.refreshToken),
  },
  actions: {
    setAuth(data: AuthToken | null) {
      if (data) {
        this.token = data.token
        this.tokenType = data.tokenType
        this.expiresAt = data.expiresAt
        this.refreshToken = data.refreshToken
        this.refreshExpiresAt = data.refreshExpiresAt
      } else {
        this.token = ''
        this.tokenType = 'Bearer'
        this.expiresAt = ''
        this.refreshToken = ''
        this.refreshExpiresAt = ''
      }
      saveToken(data)
    },
    async login(credentials: Auth) {
      const response = await loginRequest(credentials)
      this.setAuth({
        token: response.token,
        tokenType: response.tokenType || 'Bearer',
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
        refreshExpiresAt: response.refreshExpiresAt,
      })
      return response
    },
    async refresh() {
      if (!this.refreshToken) {
        throw new Error('Missing refresh token')
      }

      if (!refreshPromise) {
        const payload = buildRefreshPayload(this.refreshToken)
        const tokenUsed = this.refreshToken
        refreshPromise = refreshRequest(payload)
          .then((response) => {
            if (this.refreshToken !== tokenUsed) {
              return response
            }

            this.setAuth({
              token: response.token,
              tokenType: response.tokenType || 'Bearer',
              expiresAt: response.expiresAt,
              refreshToken: response.refreshToken,
              refreshExpiresAt: response.refreshExpiresAt,
            })
            return response
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      return refreshPromise
    },
    async logout(options: { revoke?: boolean } = { revoke: true }) {
      const { revoke } = options
      const refreshToken = this.refreshToken

      this.setAuth(null)
      refreshPromise = null
      const dyndns = useDynDNS()
      dyndns.$reset()

      if (revoke && refreshToken) {
        try {
          await logoutRequest(buildRefreshPayload(refreshToken))
        } catch {
          // ignore logout revocation failures
        }
      }
    },
  },
})

export type { Auth as Credentials, AuthToken as LoginResponse }
