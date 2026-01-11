import type { Permission } from './Permission'

export interface CreateRoleRequest {
  name: string
  permissions: Permission[]
}

export interface UpdateRoleRequest {
  permissions: Permission[]
}
