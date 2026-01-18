import type { User } from '@/models/User'
import type { ChangePasswordRequest, CreateUserRequest, SetRolesRequest } from '@/models/UserRequest'
import api from '@/plugins/axios'

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/User/users')
    return response.data
  },

  async createUser(payload: CreateUserRequest): Promise<User> {
    const response = await api.post('/User', payload)
    return response.data
  },

  async updateUserRoles(userId: string, payload: SetRolesRequest): Promise<void> {
    await api.put(`/User/${userId}/roles`, payload)
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await api.post('/User/password', payload)
  }
}
