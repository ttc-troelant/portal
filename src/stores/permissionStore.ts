import type { Permission } from '@/models/Permission'
import { roleService } from '@/services/roleService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePermissionStore = defineStore('permissions', () => {
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchPermissions(force = false) {
    if (loaded.value && !force) return

    loading.value = true

    try {
      permissions.value = await roleService.getPermissions()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    permissions,
    loading,

    // Functions
    fetchPermissions,
  }
})
