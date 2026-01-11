import type { Permission } from '@/models/Permission'
import type { Role } from '@/models/Role'
import type { CreateRoleRequest, UpdateRoleRequest } from '@/models/RoleRequest'
import api from '@/plugins/axios'

export const roleService = {
  async getRoles(): Promise<Role[]> {
    const response = await api.get('/User/roles')
    return response.data
  },

  async createRole(payload: CreateRoleRequest): Promise<Role> {
    console.log(payload)
    const response = await api.post('/User/roles', payload)
    return response.data
  },

  async updateRolePermissions(roleName: string, payload: UpdateRoleRequest): Promise<void> {
    await api.put(`/User/roles/${roleName}/permissions`, payload)
  },

  async deleteRole(roleName: string): Promise<void> {
    await api.delete(`/User/roles/${roleName}`)
  },

  // Permissions
  async getPermissions(): Promise<Permission[]> {
    const response = await api.get('/User/permissions')
    return response.data
  },
}
