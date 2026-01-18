import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
import { findFirstAllowedRoute } from './routeAccess'

const routes = [
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore()

      if (!authStore.isAuthenticated) {
        return { name: 'login' }
      }

      const firstAllowed = findFirstAllowedRoute(routes)

      return firstAllowed?.name ? { name: firstAllowed.name } : { name: 'forbidden' }
    },
  },
  {
    path: '/activities',
    name: 'activities',
    component: () => import('@/views/ActivityOverviewView.vue'),
    meta: { requiredPermission: 'Activity.View' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UserManagementView.vue'),
    meta: { requiredPermission: 'User.View' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      public: true,
    },
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import('@/views/ChangePasswordView.vue'),
    meta: { requiredPermission: 'User.ChangePassword' },
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/views/ErrorPages/ForbiddenView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!to.meta.public && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  const requiredPermission = to.meta.requiredPermission
  if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
    return { name: 'activities' }
  }
})

export default router
