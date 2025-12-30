import { defineStore } from 'pinia'
import type { Activity } from '@/models/Activity'
import { activityService } from '@/services/activityService'
import { ref } from 'vue'

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

  return {
    // Properties
    activities,
    loading,

    // Functions
    getActivities,
  }
})
