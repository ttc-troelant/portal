import ActivityOverviewView from '@/views/ActivityOverviewView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: ActivityOverviewView },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      public: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
