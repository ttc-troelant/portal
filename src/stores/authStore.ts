import type { LoginRequest } from '@/models/LoginRequest'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const accessTokenExpires = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const refreshTokenExpires = ref<string | null>(null)

  // User info from JWT
  const permissions = ref<string[]>([])
  const email = ref<string | null>(null)

  const isAuthenticated = computed(() => !!refreshToken.value)

  async function getAuthService() {
    const { authService } = await import('@/services/authService')
    return authService
  }

  async function login(payload: LoginRequest) {
    const authService = await getAuthService()
    const response = await authService.login(payload)

    const { accessToken, accessTokenExpires, refreshToken, refreshTokenExpires } = response
    setTokens(accessToken, accessTokenExpires, refreshToken, refreshTokenExpires)
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) return null

    try {
      const authService = await getAuthService()
      const response = await authService.refresh(refreshToken.value)

      const {
        accessToken: newAccessToken,
        accessTokenExpires: newAccessTokenExpires,
        refreshToken: newRefreshToken,
        refreshTokenExpires: newRefreshTokenExpires,
      } = response
      setTokens(newAccessToken, newAccessTokenExpires, newRefreshToken, newRefreshTokenExpires)

      return true
    } catch (error) {
      console.debug('Failed to refresh access token:', error)
      clearTokens()
      return false
    }
  }

  async function logout() {
    if (refreshToken.value) {
      const authService = await getAuthService()
      await authService.logout(refreshToken.value)
    }

    clearTokens()
  }

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

  function hasPermission(permission: string) {
    return permissions.value.includes(permission)
  }

  const isInitialized = ref(false)
  async function initialize(router?: ReturnType<typeof useRouter>) {
    restoreTokensFromStorage()
    if (refreshToken.value) {
      const success = await refreshAccessToken()
      if (!success) {
        // Failed refresh
        clearTokens()
        if (router) {
          router.replace({ name: 'login' })
        }
      }
    }

    isInitialized.value = true
  }

  return {
    accessToken,
    accessTokenExpires,
    refreshToken,
    refreshTokenExpires,

    permissions,
    email,
    isAuthenticated,

    login,
    logout,
    setTokens,
    clearTokens,
    isAccessTokenExpired,
    restoreTokensFromStorage,
    refreshAccessToken,
    hasPermission,

    isInitialized,
    initialize,
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
