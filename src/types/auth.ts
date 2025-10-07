export interface AuthToken {
  token: string
  tokenType: string
  expiresAt: string
}

export interface Auth {
  username: string
  password: string
}
