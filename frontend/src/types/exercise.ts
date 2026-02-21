// Allowed exercise names - keep in sync with backend
export const EXERCISE_NAMES = ['Deadlift', 'Power Clean', 'Bench Press'] as const
export type ExerciseName = (typeof EXERCISE_NAMES)[number]

export interface Exercise {
  _id: string
  userId: string
  userName?: string
  name: ExerciseName
  weight?: number
  reps?: number
  sets?: number
  notes?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateExerciseData {
  name: ExerciseName
  weight?: number
  reps?: number
  sets?: number
  notes?: string
  date?: string
}

export interface UpdateExerciseData {
  name?: ExerciseName
  weight?: number
  reps?: number
  sets?: number
  notes?: string
  date?: string
}
