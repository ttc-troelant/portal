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
import type { LoginRequest } from '@/models/LoginRequest';
import { login } from '@/services/authService';
import { reactive } from 'vue';

const form = reactive<LoginRequest>({
  email: '',
  password: ''
})

async function onLoginSubmit() {
  await login(form)
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
  ;
}
</style>