import type { User } from '@/models/User'
import type {
  ChangePasswordRequest,
  CreateUserRequest,
  SetRolesRequest,
} from '@/models/UserRequest'
import { userService } from '@/services/userServices'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      users.value = await userService.getUsers()
    } finally {
      loading.value = false
    }
  }

  async function createUser(payload: CreateUserRequest) {
    const response = await userService.createUser(payload)
    console.log('CreateUser response:', response)

    users.value.push(response)
  }

  async function updateUserRoles(userId: string, payload: SetRolesRequest) {
    await userService.updateUserRoles(userId, payload)
    await fetchUsers()
  }

  async function changePassword(payload: ChangePasswordRequest) {
    await userService.changePassword(payload)
  }

  return {
    users,
    loading,

    // Functions
    fetchUsers,
    createUser,
    updateUserRoles,
    changePassword,
  }
})
