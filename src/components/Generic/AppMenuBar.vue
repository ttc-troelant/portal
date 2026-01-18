<template>
  <Menubar :model="items">
    <template #start>
      <span class="app-title">TTC Troelant Admin</span>
    </template>

    <template #end>
      <Tag v-if="authStore.isAuthenticated" severity="success" value="Ingelogd" icon="pi pi-check" />
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { MenuItem } from 'primevue/menuitem'

const router = useRouter()
const authStore = useAuthStore()

const items = computed<MenuItem[]>(() => [
  {
    label: 'Activiteiten',
    icon: 'pi pi-calendar',
    command: () => router.push('/'),
    visible: authStore.hasPermission('Activity.View'),
  },
  {
    label: 'Gebruikers',
    icon: 'pi pi-users',
    command: () => router.push('/users'),
    visible: authStore.hasPermission('User.View'),
  },
  {
    label: 'Account',
    icon: 'pi pi-user',
    visible: authStore.isAuthenticated,
    items: [
      {
        label: 'Wachtwoord wijzigen',
        icon: 'pi pi-key',
        command: () => router.push('/change-password'),
      },
      {
        label: 'Uitloggen',
        icon: 'pi pi-sign-out',
        command: () => {
          authStore.clearTokens()
          router.push('/login')
        },
      },
    ],
  },
  {
    label: 'Login',
    icon: 'pi pi-sign-in',
    visible: !authStore.isAuthenticated,
    command: () => router.push('/login'),
  },
])
</script>

<style scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 2rem;
}

.p-menubar-item[data-p-active='true'] a {
  font-weight: bold;
  color: green;
}

.p-menuitem {
  &.p-focus {
    >.p-menuitem-content {
      background-color: aqua !important;
    }
  }
}
</style>
