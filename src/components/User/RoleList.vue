<template>
  <div>
    <div class="header">
      <h3>Functies</h3>
      <Button label="Rol Aanmaken" icon="pi pi-plus" @click="openCreate" :disabled="!can('Role.Create')" />
    </div>

    <DataTable :value="roleStore.roles" :loading="roleStore.loading" dataKey="name" stripedRows>
      <Column field="name" header="Functie" />

      <Column header="# Rechten">
        <template #body="{ data }">
          {{ data.permissions.length }}
        </template>
      </Column>

      <Column header="Acties" style="width: 160px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" class="p-button-text p-mr-2" @click="openEdit(data)"
            :disabled="!can('Role.Update')" />
          <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="confirmDelete(data.name)"
            :disabled="!can('Role.Delete')" />
        </template>
      </Column>
    </DataTable>
    <!-- <RolePermissionEditor v-if="selectedRole" :role="selectedRole" /> -->

    <RoleForm :visible="dialogVisible" :role="selectedRole" @close="closeDialog" />

    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoleStore } from '@/stores/roleStore'
import { useToast, useConfirm } from 'primevue'
import type { Role } from '@/models/Role'
import { usePermissionStore } from '@/stores/permissionStore'
import { usePermissions } from '@/composables/usePermissions'

const { can } = usePermissions()

const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const confirm = useConfirm()
const toast = useToast()

onMounted(() => {
  roleStore.fetchRoles()
  permissionStore.fetchPermissions()
})

function confirmDelete(roleName: string) {
  confirm.require({
    message: `Ben je zeker dat je de rol "${roleName}" wilt verwijderen?`,
    header: 'Verwijder rol',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Verwijderen',
    rejectLabel: 'Annuleren',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await roleStore.deleteRole(roleName)
      toast.add({
        severity: 'success',
        summary: 'Rol verwijdert',
        life: 3000,
      })
    },
  })
}

const dialogVisible = ref(false)
const selectedRole = ref<Role | null>(null)

function openCreate() {
  selectedRole.value = null
  dialogVisible.value = true
}

function openEdit(role: Role) {
  selectedRole.value = role
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
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
