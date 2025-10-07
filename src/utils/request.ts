import ky from 'ky'
// import { snake, camel } from 'radash'
import { objectToSnake, objectToCamel } from 'ts-case-convert'

import { useError } from '@/stores/error'
import { useAuth } from '@/stores/auth'
import router from '@/router'
import { AUTH_ERROR_CODES } from '@/constants/auth'
import type { ApiError } from '@/types/errors'

const service = ky.extend({
  prefixUrl: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  parseJson: (text) => objectToCamel(JSON.parse(text)),
  stringifyJson: (data) => {
    if (data === null || typeof data !== 'object') {
      return JSON.stringify(data)
    }
    return JSON.stringify(objectToSnake(data))
  },
  hooks: {
    beforeRequest: [
      (req) => {
        const auth = useAuth()
        if (auth.token) {
          req.headers.set('Authorization', `${auth.tokenType} ${auth.token}`)
        }
      },
    ],
    afterResponse: [
      (req, op, res) => {
        if (res.status == 404) {
          return new Response(null, { status: 200 })
        }
        return res
      },
    ],
    beforeError: [
      async (err) => {
        const store = useError()

        let payload: ApiError | null = null

        try {
          if (err.response) {
            payload = (await err.response.clone().json()) as ApiError
          }
        } catch {
          payload = null
        }

        const message = payload?.error ?? err.message
        if (message) {
          store.setError(message)
        }

        const shouldLogout = payload?.code && AUTH_ERROR_CODES.has(payload.code)
        if (shouldLogout) {
          const auth = useAuth()
          auth.logout()
          if (router.currentRoute.value.name !== 'Login') {
            await router.push({ name: 'Login' }).catch(() => {})
          }
        }

        return err
      },
    ],
  },
})
export default service
