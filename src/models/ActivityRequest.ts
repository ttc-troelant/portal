export interface CreateActivityRequest {
  title: string,
  description?: string,
  from: string,
  till: string,
  category: number,
  location?: string
}

export type PatchActivityRequest = Partial<CreateActivityRequest>