import type { Permission } from '@/models/Permission'
import type { Role } from '@/models/Role'
import type { CreateRoleRequest, UpdateRoleRequest } from '@/models/RoleRequest'
import { roleService } from '@/services/roleService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRoleStore = defineStore('roles', () => {
  const roles = ref<Role[]>([])
  const loading = ref(false)

  async function fetchRoles() {
    loading.value = true

    try {
      roles.value = await roleService.getRoles()
    } finally {
      loading.value = false
    }
  }

  async function createRole(payload: CreateRoleRequest) {
    try {
      const created = await roleService.createRole(payload)
      roles.value.push(created)
    } finally {
      loading.value = false
    }
  }

  async function updateRolePermissions(roleName: string, payload: UpdateRoleRequest) {
    await roleService.updateRolePermissions(roleName, payload)
    await fetchRoles()
  }

  async function deleteRole(roleName: string) {
    await roleService.deleteRole(roleName)
    roles.value = roles.value.filter((role) => role.name !== roleName)
  }

  return {
    roles,
    loading,

    // Functions
    fetchRoles,
    createRole,
    updateRolePermissions,
    deleteRole,
  }
})
