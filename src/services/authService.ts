import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest } from '@/models/LoginRequest'

export async function login(payload: LoginRequest): Promise<void> {
  const authStore = useAuthStore()

  console.log('login triggered')

  const response = await api.post('/Auth/login', payload)

  console.log('response received');
  
  const { accessToken, accessTokenExpires, refreshToken, refreshTokenExpires } = response.data

  authStore.setTokens(accessToken, accessTokenExpires, refreshToken, refreshTokenExpires)
}
