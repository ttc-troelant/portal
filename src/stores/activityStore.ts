import { defineStore } from 'pinia'
import type { Activity } from '@/models/Activity'
import { activityService } from '@/services/activityService'
import { ref } from 'vue'
import type { CreateActivityRequest, PatchActivityRequest } from '@/models/ActivityRequest'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const loading = ref(false)

  async function getActivities() {
    loading.value = true

    try {
      activities.value = await activityService.getAll()
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

  return {
    // Properties
    activities,
    loading,

    // Functions
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
  }
})
