import { useAuthStore } from '@/stores/authStore'
import ActivityOverviewView from '@/views/ActivityOverviewView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: ActivityOverviewView },
  {
    path: '/users',
    component: () => import('@/views/UserManagementView.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      public: true,
    },
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import('@/views/ChangePasswordView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// router.beforeEach((to) => {
//   const authStore = useAuthStore()
  
//   if(!to.meta.public && !authStore.refreshToken) {
//     return { name: 'login' }
//   }
// })

export default router
