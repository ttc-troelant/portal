<template>
  <Card style="max-width: 420px; margin: 0 auto">
    <template #title>Wachtwoord wijzigen</template>

    <template #content>
      <form @submit.prevent="submit">
        <div class="p-fluid">
          <div class="field">
            <Password v-model="form.currentPassword" placeholder="Huidig wachtwoord" toggleMask :feedback="false"
              :invalid="!!errors.currentPassword" />
            <small v-if="errors.currentPassword" class="p-error">
              {{ errors.currentPassword }}
            </small>
          </div>

          <div class="field">
            <Password v-model="form.newPassword" placeholder="Nieuw wachtwoord" toggleMask
              :invalid="!!errors.newPassword" />
            <small v-if="errors.newPassword" class="p-error">
              {{ errors.newPassword }}
            </small>
          </div>

          <div class="field">
            <Password v-model="form.confirmPassword" placeholder="Bevestig nieuw wachtwoord" toggleMask
              :feedback="false" :invalid="!!errors.confirmPassword" />
            <small v-if="errors.confirmPassword" class="p-error">
              {{ errors.confirmPassword }}
            </small>
          </div>

          <small class="password-hint">
            Minstens 6 tekens, hoofdletter, kleine letter, cijfer en speciaal teken.
          </small>
        </div>

        <Button type="submit" label="Wachtwoord wijzigen" />
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const toast = useToast()

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive<Record<string, string>>({})

function isValidIdentityPassword(password: string) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])

  if (!form.currentPassword) {
    errors.currentPassword = 'Huidig wachtwoord is verplicht'
  }

  if (!form.newPassword) {
    errors.newPassword = 'Nieuw wachtwoord is verplicht'
  } else if (!isValidIdentityPassword(form.newPassword)) {
    errors.newPassword = 'Wachtwoord voldoet niet aan de vereisten'
  }

  if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = 'Wachtwoorden komen niet overeen'
  }

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return

  try {
    await userStore.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    })

    toast.add({
      severity: 'success',
      summary: 'Wachtwoord gewijzigd',
      life: 3000,
    })

    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Wachtwoord wijzigen mislukt',
      detail: 'Huidig wachtwoord is onjuist',
      life: 4000,
    })
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.password-hint {
  display: block;
  margin-bottom: 1rem;
  color: var(--text-color-secondary);
  font-size: 0.85rem;
}
</style>
