import type { User } from '@/models/User'
import type { CreateUserRequest } from '@/models/UserRequest'
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
}
