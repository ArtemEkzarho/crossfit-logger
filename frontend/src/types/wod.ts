export const WOD_TYPES = ['forTime', 'amrap', 'emom', 'tabata', 'custom'] as const
export type WodType = (typeof WOD_TYPES)[number]

export interface WodMovement {
  name: string
  reps?: number
  weight?: number
  sets?: number
}

export interface WodResult {
  _id: string
  userId: string
  userName: string
  timeSeconds?: number
  rounds?: number
  reps?: number
  totalReps?: number
  notes?: string
  rxd: boolean
  loggedAt: string
}

export interface Wod {
  _id: string
  createdBy: string
  date: string
  type: WodType
  name?: string
  movements: WodMovement[]
  notes?: string
  results: WodResult[]
  createdAt: string
  updatedAt: string
}

export interface CreateWodData {
  date: string
  type: WodType
  name?: string
  movements: WodMovement[]
  notes?: string
}

export interface AddWodResultData {
  timeSeconds?: number
  rounds?: number
  reps?: number
  totalReps?: number
  notes?: string
  rxd: boolean
}

export function formatResult(type: WodType, result: Pick<WodResult, 'timeSeconds' | 'rounds' | 'reps' | 'totalReps'>): string | null {
  switch (type) {
    case 'forTime': {
      if (result.timeSeconds == null) return null
      const m = Math.floor(result.timeSeconds / 60)
      const s = result.timeSeconds % 60
      return `${m}:${String(s).padStart(2, '0')}`
    }
    case 'amrap':
      if (result.rounds == null) return null
      return result.reps != null ? `${result.rounds} rds + ${result.reps} reps` : `${result.rounds} rounds`
    case 'emom':
      return result.rounds != null ? `${result.rounds} rounds` : null
    case 'tabata':
      return result.totalReps != null ? `${result.totalReps} reps` : null
    case 'custom':
      return null
  }
}

export const WOD_TYPE_COLORS: Record<WodType, 'primary' | 'success' | 'warning' | 'error' | 'default'> = {
  forTime: 'primary',
  amrap: 'success',
  emom: 'warning',
  tabata: 'error',
  custom: 'default',
}
