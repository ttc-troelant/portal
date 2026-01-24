import api from '@/plugins/axios'
import type { Activity } from '@/models/Activity'
import type { CreateActivityRequest, PatchActivityRequest } from '@/models/ActivityRequest'

export const activityService = {
  async getAll(): Promise<Activity[]> {
    const response = await api.get<Activity[]>('/Activity')
    return response.data
  },

  async create(payload: CreateActivityRequest): Promise<Activity> {
    const { data } = await api.post('/Activity', payload)
    return data
  },

  async update(id: number, payload: PatchActivityRequest): Promise<Activity> {
    const { data } = await api.patch(`/Activity/${id}`, payload)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Activity/${id}`)
  },

  async importIcs(file: File): Promise<{ imported: number; activities: Activity[] }> {
    const form = new FormData()
    form.append('file', file)
    console.log([...form.entries()]);
    const { data } = await api.post('/Activity/import', form)
    return data
  },
}
