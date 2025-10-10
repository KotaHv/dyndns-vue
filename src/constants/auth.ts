export const REFRESHABLE_ERROR_CODES = new Set(['token_expired'])

export const FATAL_AUTH_ERROR_CODES = new Set([
  'invalid_token',
  'invalid_refresh_token',
  'refresh_token_expired',
  'token_encoding_failed',
  'refresh_token_hash_failed',
  'refresh_token_verification_failed',
])
