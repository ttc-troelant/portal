import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function usePermissions() {
  const authStore = useAuthStore()

  /**
   * Returns a boolean if the user has the given permission
   */
  function hasPermission(permission: string): boolean {
    return authStore.hasPermission(permission)
  }

  /**
   * Returns a computed for use directly in templates (reactive)
   */
  function can(permission: string) {
    return computed(() => authStore.hasPermission(permission))
  }

  return { hasPermission, can }
}
