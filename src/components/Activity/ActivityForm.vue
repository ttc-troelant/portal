<template>
  <Dialog :visible="visible" modal header="Activiteit" @update:visible="closeDialog">
    <form @submit.prevent="submit">
      <div class="p-fluid">
        <div class="field">
          <Textarea v-model="form.title" placeholder="Titel" :invalid="!!errors.title" 
          autoResize/>
          <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
        </div>

        <div class="field">
          <Textarea v-model="form.description" placeholder="Beschrijving" autoResize />
        </div>

        <div class="field">
          <DatePicker v-model="form.from" showTime showIcon 
          placeholder="Van"
          :invalid="!!errors.from"/>
          <small v-if="errors.from" class="p-error">{{ errors.from }}</small>
        </div>

        <div class="field">
          <DatePicker v-model="form.till" showTime showIcon
          placeholder="Tot"
          :invalid="!!errors.till" />
          <small v-if="errors.till" class="p-error">{{ errors.till }}</small>
        </div>

        <div class="field">
          <Select v-model="form.category" 
          :options="ActivityCategoryOptions" optionLabel="label" optionValue="value"
          placeholder="Categorie" 
          checkmark
          :invalid="!!errors.category"/>
          <small v-if="errors.category" class="p-error">{{ errors.category }}</small>
        </div>

        <div class="field">
          <Textarea v-model="form.location" placeholder="Locatie" autoResize />
        </div>
      </div>

      <div class="form-buttons">
        <Button label="Annuleren" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Opslaan" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import { useActivityStore } from '@/stores/activityStore'
import { ActivityCategoryOptions, type Activity } from '@/models/Activity';
import type { CreateActivityRequest, PatchActivityRequest } from '@/models/ActivityRequest';
import { Textarea } from 'primevue';

const props = defineProps<{
  visible: boolean
  activity?: Activity | null
}>()

const emit = defineEmits(['close'])

const store = useActivityStore()

const form = reactive({
  title: props.activity?.title ?? '',
  description: props.activity?.description ?? '',
  from: props.activity ? new Date(props.activity.from) : null,
  till: props.activity ? new Date(props.activity.till) : null,
  category: props.activity?.category ?? null,
  location: props.activity?.location ?? '',
})

const errors = reactive<Record<string, string>>({})

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.title) errors.title = 'Titel is verplicht'
  if (!form.from) errors.from = 'Van datum is verplicht'
  if (!form.till) errors.till = 'Tot datum is verplicht'
  if (form.category === null) errors.category = 'Categorie is verplicht'

  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return

  const payload = {
    title: form.title,
    description: form.description || undefined,
    from: form.from!.toISOString(),
    till: form.till!.toISOString(),
    category: form.category,
    location: form.location || undefined,
  }

  if (props.activity) {
    await store.updateActivity(props.activity.id, payload as PatchActivityRequest)
  } else {
    await store.createActivity(payload as CreateActivityRequest)
  }

  emit('close')
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.from = null
  form.till = null
  form.category = null
  form.location = ''
  Object.keys(errors).forEach(key => delete errors[key])
}

function closeDialog() {
  resetForm()
  emit('close')
}

watch(
  () => props.activity,
  (activity) => {
    if (activity) {
      form.title = activity.title
      form.description = activity.description ?? ''
      form.from = new Date(activity.from)
      form.till = new Date(activity.till)
      form.category = activity.category
      form.location = activity.location ?? ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 1rem;
}

.field small {
  color: red;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
