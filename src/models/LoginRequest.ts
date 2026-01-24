export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  accessTokenExpires: string
  refreshToken: string
  refreshTokenExpires: string
}
