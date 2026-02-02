export interface Exercise {
  _id: string
  userId: string
  name: string
  weight?: number
  reps?: number
  sets?: number
  notes?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateExerciseData {
  name: string
  weight?: number
  reps?: number
  sets?: number
  notes?: string
  date?: string
}

export interface UpdateExerciseData {
  name?: string
  weight?: number
  reps?: number
  sets?: number
  notes?: string
  date?: string
}
