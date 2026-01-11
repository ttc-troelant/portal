import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

// TODO: Add timeout to api calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(async (config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) config.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
  return config
})

let isRefreshing = false
let queue: ((token: string) => void)[] = []

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const authStore = useAuthStore()
    const original = err.config

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        const newToken = await authStore.refreshAccessToken()
        isRefreshing = false

        queue.forEach((cb) => cb(newToken))
        queue = []
      }

      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.set('Authorization', `Bearer ${token}`)
          resolve(api(original))
        })
      })
    }

    return Promise.reject(err)
  },
)

export default api

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
