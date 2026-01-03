<template>
  <DataTable :value="activityStore.activities" removableSort :loading="activityStore.loading" stripedRows>
    <template #header>
      <div class="table-header">
        <span class="table-header-title">Activiteiten</span>
        <div class="table-header-buttons">
          <Button @click="openCreate"><i class="pi pi-plus-circle" />Toevoegen</Button>
          <Button @click="importIcs" :disabled="isImporting"><i class="pi pi-download" />Importeer ICS</Button>
        </div>
      </div>
    </template>
    <Column field="title" header="Titel" />
    <Column field="description" header="Beschrijving" />
    <Column field="from" header="Van" sortable>
      <template #body="slotProps">
        {{ dateDisplay(slotProps.data.from) }}
      </template>
    </Column>
    <Column field="till" header="Tot">
      <template #body="slotProps">
        {{ dateDisplay(slotProps.data.till) }}
      </template>
    </Column>
    <Column field="location" header="Locatie" />
    <Column header="Acties">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" class="p-button-text p-mr-2" @click="openEdit(slotProps.data)" />
        <Button icon="pi pi-trash" :disabled="isDeleting" class="p-button-text p-button-danger"
          @click="confirmDelete(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <ConfirmDialog />
  <ActivityForm :visible="dialogVisible" :activity="selectedActivity" @close="closeDialog" />
</template>

<script setup lang="ts">
import type { Activity } from '@/models/Activity';
import { useActivityStore } from '@/stores/activityStore';
import { useConfirm } from 'primevue';
import { onMounted, ref } from 'vue';
import ActivityForm from './ActivityForm.vue';


const activityStore = useActivityStore()

const dateFormatter = new Intl.DateTimeFormat('nl-BE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const dateDisplay = (dateString: string) => {
  const date = new Date(dateString)
  return dateFormatter.format(date)
}

const confirm = useConfirm()
const isDeleting = ref(false)
const confirmDelete = (activity: { id: number, title: string }) => {
  confirm.require({
    message: `Weet je zeker dat je de activiteit ${activity.title} wilt verwijderen?`,
    header: 'Verwijder Activiteit',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Verwijderen',
    rejectLabel: 'Annuleren',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',

    accept: async () => {
      isDeleting.value = true
      try {
        await activityStore.deleteActivity(activity.id)
      } finally {
        isDeleting.value = false
      }
    },
    reject: () => {
      // Do nothing
    }
  })
}

const dialogVisible = ref(false)
const selectedActivity = ref<Activity | null>(null)

function openCreate() {
  selectedActivity.value = null
  dialogVisible.value = true
}

function openEdit(activity: Activity) {
  selectedActivity.value = activity
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

const isImporting = ref(false)
function importIcs() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.ics,text/calendar'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement)?.files?.[0]
    if (!file) return
    isImporting.value = true
    try {
      await activityStore.importIcs(file)
    } catch (err) {
      console.error('ICS import failed', err)
    } finally {
      isImporting.value = false
    }
  }
  input.click()
}

onMounted(() => {
  activityStore.getActivities()
})
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.table-header-buttons>button {
  margin-left: 0.5rem;
}
</style>