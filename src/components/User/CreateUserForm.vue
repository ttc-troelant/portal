<template>
  <Dialog :visible="visible" modal header="Gebruiker aanmaken" @update:visible="closeDialog" style="width: 600px">
    <form @submit.prevent="submit">
      <div class="p-fluid">
        <div class="field">
          <InputText v-model="form.email" placeholder="Email" :invalid="!!errors.email" />
          <Message v-if="errors.email" severity="error" variant="simple" size="small">{{ errors.email }}</Message>
        </div>

        <div class="field">
          <Password v-model="form.password" placeholder="Wachtwoord" fluid toggleMask :feedback="false"
            :invalid="!!errors.password" />
          <Message v-if="errors.password" severity="error" variant="simple" size="small">{{ errors.password }}</Message>
        </div>

        <div class="field">
          <InputText v-model="form.firstName" placeholder="Voornaam" />
        </div>

        <div class="field">
          <InputText v-model="form.lastName" placeholder="Achternaam" />
        </div>

        <PickList v-model="pickListValue" listStyle="height:250px">
          <template #sourceheader>Functies</template>
          <template #targetheader>Toegewezen</template>
          <template #option="{ option }">
            {{ option }}
          </template>
        </PickList>
      </div>

      <div class="form-buttons">
        <Button label="Annuleren" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Aanmaken" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

import { useUserStore } from '@/stores/userStore'
import { useRoleStore } from '@/stores/roleStore'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['close'])

const userStore = useUserStore()
const roleStore = useRoleStore()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const errors = reactive<Record<string, string>>({})

// PickList uses tuple-based v-model
const pickListValue = ref<[string[], string[]]>([[], []])

function rebuildPickList() {
  const allRoles = roleStore.roles.map(r => r.name)
  pickListValue.value = [allRoles, []]
}

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.email) errors.email = 'Email is verplicht'
  if (!form.password) errors.password = 'Wachtwoord is verplicht'

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return

  const [, selectedRoles] = pickListValue.value

  await userStore.createUser({
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    lastName: form.lastName,
    roles: selectedRoles,
  })

  toast.add({
    severity: 'success',
    summary: 'Gebruiker aangemaakt',
    life: 3000,
  })

  closeDialog()
}

function resetForm() {
  form.email = ''
  form.password = ''
  pickListValue.value = [[], []]
  Object.keys(errors).forEach(k => delete errors[k])
}

function closeDialog() {
  resetForm()
  emit('close')
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) return

    if (!roleStore.roles.length) {
      await roleStore.fetchRoles()
    }

    rebuildPickList()
  }
)
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 1rem;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>