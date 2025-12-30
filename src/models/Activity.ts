export interface Activity {
  id: number,
  title: string,
  description?: string,
  from: string,
  till: string,
  category: number,
  location?: string
}