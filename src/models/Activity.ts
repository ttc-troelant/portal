export interface Activity {
  id: number
  title: string
  description?: string
  from: string
  till: string
  category: number
  location?: string
}

export enum ActivityCategory {
  ONBESCHIKBAAR = -1,
  ALGEMEEN = 0,
  BEKER = 1,
  MASTER = 2,
  APLOEG = 10,
  BPLOEG = 11,
  CPLOEG = 12,
  DPLOEG = 13,
}

export const ActivityCategoryOptions = [
  { label: 'Onbeschikbaar', value: ActivityCategory.ONBESCHIKBAAR },
  { label: 'Algemeen', value: ActivityCategory.ALGEMEEN },
  { label: 'Beker', value: ActivityCategory.BEKER },
  { label: 'Master', value: ActivityCategory.MASTER },
  { label: 'A-Ploeg', value: ActivityCategory.APLOEG },
  { label: 'B-Ploeg', value: ActivityCategory.BPLOEG },
  { label: 'C-Ploeg', value: ActivityCategory.CPLOEG },
  { label: 'D-Ploeg', value: ActivityCategory.DPLOEG },
]
