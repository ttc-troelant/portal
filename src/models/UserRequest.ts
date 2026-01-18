export interface CreateUserRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  roles: string[]
}

export interface SetRolesRequest {
  roles: string[]
}

export interface ChangePasswordRequest {
  currentPassword: string,
  newPassword: string
}
