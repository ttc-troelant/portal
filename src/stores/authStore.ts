import api, { authApi } from '@/plugins/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const accessTokenExpires = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const refreshTokenExpires = ref<string | null>(null)

  // User info from JWT
  const permissions = ref<string[]>([])
  const email = ref<string | null>(null)

  const isAuthenticated = computed(() => !!refreshToken.value)

  function setTokens(
    newAccessToken: string,
    newAccessTokenExpires: string,
    newRefreshToken: string,
    newRefreshTokenExpires: string,
  ) {
    accessToken.value = newAccessToken
    accessTokenExpires.value = newAccessTokenExpires
    refreshToken.value = newRefreshToken
    refreshTokenExpires.value = newRefreshTokenExpires

    // extract permissions from the access token
    const payload = decodeJwt(newAccessToken)
    permissions.value = payload?.permission ?? []
    email.value = payload?.email ?? null

    localStorage.setItem('accessToken', accessToken.value)
    localStorage.setItem('accessTokenExpires', accessTokenExpires.value)
    localStorage.setItem('refreshToken', refreshToken.value)
    localStorage.setItem('refreshTokenExpires', refreshTokenExpires.value)
    localStorage.setItem('permissions', JSON.stringify(permissions.value))
    localStorage.setItem('email', email.value ?? '')
  }

  function restoreTokensFromStorage() {
    accessToken.value = localStorage.getItem('accessToken')
    accessTokenExpires.value = localStorage.getItem('accessTokenExpires')
    refreshToken.value = localStorage.getItem('refreshToken')
    refreshTokenExpires.value = localStorage.getItem('refreshTokenExpires')
    permissions.value = JSON.parse(localStorage.getItem('permissions') || '[]')
    email.value = localStorage.getItem('email') || null
  }

  function clearTokens() {
    accessToken.value = null
    accessTokenExpires.value = null
    refreshToken.value = null
    refreshTokenExpires.value = null
    permissions.value = []
    email.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('accessTokenExpires')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('refreshTokenExpires')
    localStorage.removeItem('permissions')
    localStorage.removeItem('email')
  }

  function isAccessTokenExpired(): boolean {
    if (!accessTokenExpires.value) return true
    return new Date(accessTokenExpires.value) <= new Date()
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) return null

    try {
      const response = await authApi.post('/auth/refresh', {
        refreshToken: refreshToken.value,
      })

      const { newAccessToken, newAccessTokenExpires, newRefreshToken, newRefreshTokenExpires } =
        response.data
      setTokens(newAccessToken, newAccessTokenExpires, newRefreshToken, newRefreshTokenExpires)

      return newAccessToken
    } catch (error) {
      console.debug('Failed to refresh access token:', error)
      clearTokens()
      return null
    }
  }

  function hasPermission(permission: string) {
    return permissions.value.includes(permission)
  }

  return {
    accessToken,
    accessTokenExpires,
    refreshToken,
    refreshTokenExpires,

    permissions,
    email,
    isAuthenticated,

    setTokens,
    clearTokens,
    isAccessTokenExpired,
    restoreTokensFromStorage,
    refreshAccessToken,
    hasPermission,
  }
})

function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1] ?? ''
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}
