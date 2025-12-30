import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  function setTokens(accessToken: string, refreshToken: string) {
    accessToken = accessToken
    refreshToken = refreshToken

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return {
    setTokens,
    clearTokens,
  }
})
