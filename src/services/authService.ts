import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest } from '@/models/LoginRequest'

export async function login(payload: LoginRequest): Promise<void> {
  const authStore = useAuthStore()

  const response = await axios.post('/auth/login', payload)

  const { accessToken, refreshToken } = response.data

  authStore.setTokens(accessToken, refreshToken)
}
