import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

api.interceptors.request.use(async (config) => {
  const authStore = useAuthStore()

  if (authStore.isAccessTokenExpired()) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = authStore.refreshAccessToken().finally(() => {
        isRefreshing = false
      })
    }

    const newToken = await refreshPromise
    if (!newToken) {
      return config
    }
  }

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

export default api

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
