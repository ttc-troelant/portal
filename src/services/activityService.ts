import api from '@/plugins/axios'
import type { Activity } from '@/models/Activity'

export const activityService = {
  async getAll(): Promise<Activity[]> {
    const response = await api.get<Activity[]>('/Activity')
    return response.data
  },
}
