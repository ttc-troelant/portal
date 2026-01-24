import axios from 'axios'

const timeout = 2000 // 2 seconds

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: timeout,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authStoreInstance: any = null

async function getAuthStore() {
  if (!authStoreInstance) {
    const { useAuthStore } = await import('@/stores/authStore')
    authStoreInstance = useAuthStore()
  }
  return authStoreInstance
}

api.interceptors.request.use(async (config) => {
  const store = await getAuthStore()

  // Preemptively refresh if access token is expired but refresh token exists
  if (store.isAccessTokenExpired() && store.refreshToken) {
    await store.refreshAccessToken()
  }

  if (store.accessToken) config.headers.set('Authorization', `Bearer ${store.accessToken}`)
  return config
})

let isRefreshing = false
let queue: ((token: string | null) => void)[] = []

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // Delay store access to avoid circular dependency at initialization
    const store = await getAuthStore()
    const original = err.config

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        const success = await store.refreshAccessToken()
        isRefreshing = false

        const token = success ? store.accessToken : null
        queue.forEach((cb) => cb(token))
        queue = []

        // If refresh failed, reject the original request
        if (!success) {
          return Promise.reject(err)
        }
      }

      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (token) {
            original.headers.set('Authorization', `Bearer ${token}`)
            resolve(api(original))
          } else {
            reject(err)
          }
        })
      })
    }

    return Promise.reject(err)
  },
)

export default api
