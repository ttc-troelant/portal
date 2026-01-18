import api, { authApi } from '@/plugins/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const accessTokenExpires = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const refreshTokenExpires = ref<string | null>(null)

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

    localStorage.setItem('accessToken', accessToken.value)
    localStorage.setItem('accessTokenExpires', accessTokenExpires.value)
    localStorage.setItem('refreshToken', refreshToken.value)
    localStorage.setItem('refreshTokenExpires', refreshTokenExpires.value)
  }

  function restoreTokensFromStorage() {
    accessToken.value = localStorage.getItem('accessToken')
    accessTokenExpires.value = localStorage.getItem('accessTokenExpires')
    refreshToken.value = localStorage.getItem('refreshToken')
    refreshTokenExpires.value = localStorage.getItem('refreshTokenExpires')
  }

  function clearTokens() {
    accessToken.value = null
    accessTokenExpires.value = null
    refreshToken.value = null
    refreshTokenExpires.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('accessTokenExpires')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('refreshTokenExpires')
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

  return {
    accessToken,
    accessTokenExpires,
    refreshToken,
    refreshTokenExpires,
    setTokens,
    clearTokens,
    isAccessTokenExpired,
    restoreTokensFromStorage,
    refreshAccessToken,
  }
})
