<template>
  <DataTable :value="activityStore.activities" removableSort :loading="activityStore.loading" stripedRows>
    <template #header>
      <div class="table-header">
        <span class="table-header-title">Activiteiten</span>
        <Button><i class="pi pi-plus-circle"> Toevoegen</i></Button>
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
        <Button icon="pi pi-pencil" class="p-button-text p-mr-2" />
        <Button icon="pi pi-trash" class="p-button-text p-button-danger" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { useActivityStore } from '@/stores/activityStore';
import { onMounted } from 'vue';


const activityStore = useActivityStore()

const dateFormatter = new Intl.DateTimeFormat('nl-BE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC'
})

// TODO: Fix date display function => multiple days inbetween dates out of nowhere
const dateDisplay = (dateString: string) => {
  const date = new Date(dateString)
  return dateFormatter.format(date)
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
</style>