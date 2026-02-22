// Allowed exercise names - keep in sync with backend
export const EXERCISE_NAMES = ['Deadlift', 'Power Clean', 'Bench Press'] as const
export type ExerciseName = (typeof EXERCISE_NAMES)[number]

export interface WeightEntry {
  _id: string
  weight: number
  reps?: number
  sets?: number
  notes?: string
  date: string
}

export interface Exercise {
  _id: string
  userId: string
  userName?: string
  name: ExerciseName
  weightHistory: WeightEntry[]
  createdAt: string
  updatedAt: string
}

export function getMaxWeight(exercise: Exercise): number | undefined {
  if (!exercise.weightHistory?.length) return undefined
  return Math.max(...exercise.weightHistory.map((e) => e.weight))
}

export interface LogWeightData {
  name: ExerciseName
  weight: number
  reps?: number
  sets?: number
  notes?: string
  date: string
}

export interface UpdateWeightEntryData {
  weight?: number
  reps?: number
  sets?: number
  notes?: string
  date?: string
}
