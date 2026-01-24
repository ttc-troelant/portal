import type { LoginRequest, LoginResponse } from '@/models/LoginRequest'
import axios from 'axios'

const timeout = 2000
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: timeout,
})

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await authApi.post('/Auth/login', payload)
    return response.data
  },

  async refresh(refreshTokenValue: string): Promise<LoginResponse> {
    const response = await authApi.post('/Auth/refresh', {
      refreshToken: refreshTokenValue,
    })
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await authApi.post('/Auth/revoke', refreshToken)
  },
}
