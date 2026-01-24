<template>
  <form @submit.prevent="onLoginSubmit">
    <div class="login-form">
      <div class="fields">
        <InputText id="email" inputmode="email" v-model="form.email" type="email" required placeholder="email" />
        <Password id="password" v-model="form.password" toggleMask :feedback="false" required
          placeholder="wachtwoord" />
      </div>
      <Button type="submit" label="Aanmelden" />
    </div>
  </form>
</template>
<script setup lang="ts">
import type { LoginRequest } from '@/models/LoginRequest'
import { findFirstAllowedRoute } from '@/router/routeAccess'
import { useAuthStore } from '@/stores/authStore'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginRequest>({
  email: '',
  password: '',
})

async function onLoginSubmit() {
  await authStore.login(form)

  const firstAllowed = findFirstAllowedRoute(router.getRoutes())

  router.push(firstAllowed?.name ? { name: firstAllowed.name } : { name: 'forbidden' })
}
</script>

<style scoped>
form {
  max-width: 400px;
  margin: auto 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
