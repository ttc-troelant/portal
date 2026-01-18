<template>
  <div>
    <div class="header">
      <h3>Gebruikers</h3>
      <Button label="Gebruiker aanmaken" icon="pi pi-plus" @click="openCreate" />
    </div>

    <DataTable :value="userStore.users" :loading="userStore.loading" dataKey="id" stripedRows>
      <Column field="email" header="Email" />
      <Column header="Naam">
        <template #body="{ data }">
          {{ showFullName(data) }}
        </template>
      </Column>
      <Column header="Functies">
        <template #body="{ data }">
          {{ data.roles.join(', ') }}
        </template>
      </Column>

      <Column header="Acties" style="width: 160px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" class="p-button-text p-mr-2" @click="openEdit(data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-danger" disabled />
        </template>
      </Column>
    </DataTable>

    <CreateUserForm :visible="createDialogVisible" @close="closeCreateDialog" />
    <EditUserRolesForm :visible="editDialogVisible" :user="selectedUser" @close="closeEditDialog"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/models/User'
import EditUserRolesForm from './EditUserRolesForm.vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUsers()
})

function showFullName(user: { firstName?: string, lastName?: string }) {
  if (!user) return ''
  return [user.firstName, user.lastName].filter(Boolean).join(' ')
}

const createDialogVisible = ref(false)

function openCreate() {
  createDialogVisible.value = true
}

function closeCreateDialog() {
  createDialogVisible.value = false
}

const editDialogVisible = ref(false)
const selectedUser = ref<User | null>(null)

function openEdit(user: User) {
  selectedUser.value = user
  editDialogVisible.value = true
}

function closeEditDialog(){
  selectedUser.value = null
  editDialogVisible.value = false
}


</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>