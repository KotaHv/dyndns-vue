export interface AuthToken {
  token: string
  tokenType: string
  expiresAt: string
  refreshToken: string
  refreshExpiresAt: string
}

export interface Auth {
  username: string
  password: string
}

export interface RefreshRequest {
  refreshToken: string
}
