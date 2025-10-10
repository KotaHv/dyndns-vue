import ky from 'ky'
// import { snake, camel } from 'radash'
import { objectToSnake, objectToCamel } from 'ts-case-convert'

import { useError } from '@/stores/error'
import { useAuth } from '@/stores/auth'
import router from '@/router'
import { FATAL_AUTH_ERROR_CODES, REFRESHABLE_ERROR_CODES } from '@/constants/auth'
import type { ApiError } from '@/types/errors'

const refreshedRequests = new WeakSet<Request>()

async function parseErrorResponse(response?: Response | null): Promise<ApiError | null> {
  if (!response) {
    return null
  }
  try {
    return (await response.clone().json()) as ApiError
  } catch {
    return null
  }
}

async function redirectToLogin() {
  if (router.currentRoute.value.name !== 'Login') {
    await router.push({ name: 'Login' }).catch(() => {})
  }
}

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
      async (req, options, res) => {
        if (res.status === 401) {
          const payload = await parseErrorResponse(res)
          if (payload?.code && REFRESHABLE_ERROR_CODES.has(payload.code)) {
            if (refreshedRequests.has(req)) {
              return res
            }
            const auth = useAuth()
            if (!auth.canRefresh) {
              await auth.logout({ revoke: false })
              await redirectToLogin()
              return res
            }

            try {
              await auth.refresh()
              if (!auth.token) {
                await auth.logout({ revoke: false })
                await redirectToLogin()
                return res
              }
              const authorization = `${auth.tokenType} ${auth.token}`
              const retryRequest = new Request(req, {
                headers: new Headers(req.headers),
              })
              retryRequest.headers.set('Authorization', authorization)
              refreshedRequests.add(retryRequest)

              return service(retryRequest)
            } catch {
              await auth.logout({ revoke: false })
              await redirectToLogin()
              return res
            }
          }
        }

        return res
      },
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

        const payload = await parseErrorResponse(err.response)

        const message = payload?.error ?? err.message
        if (message) {
          store.setError(message)
        }

        const shouldLogout = payload?.code && FATAL_AUTH_ERROR_CODES.has(payload.code)
        if (shouldLogout) {
          const auth = useAuth()
          await auth.logout({ revoke: false })
          await redirectToLogin()
        }

        return err
      },
    ],
  },
})
export default service
