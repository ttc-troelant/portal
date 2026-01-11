<template>
  <Dialog :visible="visible" modal :header="role ? 'Rol bewerken' : 'Rol aanmaken'" @update:visible="closeDialog"
    style="width: 600px">
    <form @submit.prevent="submit">
      <div class="p-fluid">
        <div class="field">
          <InputText v-model="form.name" placeholder="Rolnaam" :invalid="!!errors.name" :disabled="!!role" />
          <Message v-if="errors.name" severity="error" variant="simple" size="small">{{ errors.name }}</Message>
        </div>

        <PickList v-model="pickListValue" listStyle="height:300px">
          <template #sourceheader>Beschikbaar</template>
          <template #targetheader>Toegewezen</template>
          <template #option="{ option }">
            {{ option }}
          </template>
        </PickList>
      </div>

      <div class="form-buttons">
        <Button label="Annuleren" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Opslaan" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Role } from '@/models/Role'

import { useRoleStore } from '@/stores/roleStore'
import { usePermissionStore } from '@/stores/permissionStore'
import { useToast } from 'primevue/usetoast'
import type { CreateRoleRequest, UpdateRoleRequest } from '@/models/RoleRequest'

const props = defineProps<{
  visible: boolean
  role?: Role | null
}>()

const emit = defineEmits(['close'])

const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const toast = useToast()

const form = reactive({
  name: '',
})

const errors = reactive<Record<string, string>>({})

const pickListValue = ref<[string[], string[]]>([[], []])

function rebuildPickList() {
  const assigned = new Set(props.role?.permissions ?? [])

  const source = permissionStore.permissions.filter(p => !assigned.has(p))
  const target = [...assigned]

  pickListValue.value = [source, target]
}

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!props.role && !form.name) {
    errors.name = 'Rolnaam is verplicht'
  }

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return

  const [, selectedPermissions] = pickListValue.value

  if (props.role) {
    const payload: UpdateRoleRequest = {
      permissions: selectedPermissions
    }
    await roleStore.updateRolePermissions(props.role.name, payload)
    toast.add({
      severity: 'success',
      summary: 'Rol bijgewerkt',
      life: 3000,
    })
  } else {
    const createRoleRequest: CreateRoleRequest = {
      name: form.name,
      permissions: selectedPermissions
    }

    await roleStore.createRole(createRoleRequest)
    toast.add({
      severity: 'success',
      summary: 'Rol aangemaakt',
      life: 3000,
    })
  }

  closeDialog()
}

function resetForm() {
  form.name = ''
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

    await permissionStore.fetchPermissions()

    if (props.role) {
      form.name = props.role.name
    } else {
      form.name = ''
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