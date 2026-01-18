import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export function findFirstAllowedRoute(
  routes: RouteRecordRaw[],
): RouteRecordRaw | null {
  const authStore = useAuthStore()

  for (const route of routes) {
    // skip redirect-only routes
    if (route.redirect) continue

    // must have a name (so we can navigate to it safely)
    if (!route.name) continue

    // skip public routes
    if (route.meta?.public) continue

    const requiredPermission = route.meta?.requiredPermission as string | undefined
    if (!requiredPermission) continue

    if (authStore.hasPermission(requiredPermission)) {
      return route
    }
  }

  return null
}
