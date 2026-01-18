<template>
  <Dialog :visible="visible" modal header="Gebruiker bewerken" @update:visible="closeDialog" style="width: 600px">
    <div class="user-info">
      <strong>{{ user?.email }}</strong>
    </div>

    <form @submit.prevent="submit">
      <PickList v-model="pickListValue" listStyle="height:250px">
        <template #sourceheader>Rollen</template>
        <template #targetheader>Toegewezen</template>
        <template #option="{ option }">
          {{ option }}
        </template>
      </PickList>

      <div class="form-buttons">
        <Button label="Annuleren" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Opslaan" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/models/User'

import { useUserStore } from '@/stores/userStore'
import { useRoleStore } from '@/stores/roleStore'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  visible: boolean
  user: User | null
}>()

const emit = defineEmits(['close'])

const userStore = useUserStore()
const roleStore = useRoleStore()
const toast = useToast()

// PickList tuple model
const pickListValue = ref<[string[], string[]]>([[], []])

function rebuildPickList() {
  if (!props.user) return

  const assigned = new Set(props.user.roles)
  const allRoles = roleStore.roles.map((r) => r.name)

  const source = allRoles.filter((r) => !assigned.has(r))
  const target = [...assigned]

  pickListValue.value = [source, target]
}

async function submit() {
  if (!props.user) return

  const [, selectedRoles] = pickListValue.value

  await userStore.updateUserRoles(props.user.id, { roles: selectedRoles })

  toast.add({
    severity: 'success',
    summary: 'Gebruiker bijgewerkt',
    life: 3000,
  })

  closeDialog()
}

function reset() {
  pickListValue.value = [[], []]
}

function closeDialog() {
  reset()
  emit('close')
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible || !props.user) return

    if (!roleStore.roles.length) {
      await roleStore.fetchRoles()
    }

    rebuildPickList()
  },
)
</script>

<style scoped>
.user-info {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  opacity: 0.8;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
