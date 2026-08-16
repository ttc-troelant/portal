import { defineStore } from 'pinia'
import type { Activity } from '@/models/Activity'
import { activityService } from '@/services/activityService'
import { ref } from 'vue'
import type { CreateActivityRequest, PatchActivityRequest } from '@/models/ActivityRequest'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const loading = ref(false)

  async function getActivities(showPastActivities: boolean) {
    loading.value = true

    try {
      activities.value = await activityService.getAll(showPastActivities)
    } finally {
      loading.value = false
    }
  }

  async function createActivity(payload: CreateActivityRequest) {
    loading.value = true

    try {
      const created = await activityService.create(payload)
      activities.value.push(created)
    } finally {
      loading.value = false
    }
  }

  async function updateActivity(id: number, payload: PatchActivityRequest) {
    loading.value = true

    try {
      const updated = await activityService.update(id, payload)
      const index = activities.value.findIndex((activity) => activity.id === id)
      if (index !== -1) activities.value[index] = updated
    } finally {
      loading.value = false
    }
  }

  async function deleteActivity(id: number) {
    loading.value = true

    try {
      await activityService.delete(id)
      activities.value = activities.value.filter((activity) => activity.id !== id)
    } finally {
      loading.value = false
    }
  }

  async function importIcs(file: File) {
    loading.value = true
    try {
      const result = await activityService.importIcs(file)
      const created = result.activities ?? []
      for (const a of created) {
        if (!activities.value.some(e => e.id === a.id)) activities.value.push(a)
      }
      return result
    } finally {
      loading.value = false
    }
  }

  return {
    // Properties
    activities,
    loading,

    // Functions
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    importIcs,
  }
})
