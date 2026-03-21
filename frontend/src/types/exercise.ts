// Allowed exercise names - keep in sync with backend
export const EXERCISE_NAMES = [
  // Barbell — weight
  'Deadlift',
  'Power Clean',
  'Squat Clean',
  'Clean and Jerk',
  'Hang Power Clean',
  'Bench Press',
  'Front Squat',
  'Back Squat',
  'Overhead Squat',
  'Push Press',
  'Strict Press',
  'Thruster',
  'Power Snatch',
  'Hang Power Snatch',
  'Snatch',
  'Back Lunges',
  // Bodyweight — reps
  'Push Up',
  'Pull Up',
  'Handstand Push Up',
  'Muscle Up',
  'Ring Dip',
  'Toes to Bar',
  'Sit Up',
  'Air Squat',
  'Burpee',
  'Box Jump',
  'Double Under',
] as const
export type ExerciseName = (typeof EXERCISE_NAMES)[number]

export type ExerciseMetric = 'weight' | 'reps'

export const EXERCISE_DEFINITIONS: Record<ExerciseName, { metric: ExerciseMetric }> = {
  // Barbell — weight
  'Deadlift': { metric: 'weight' },
  'Power Clean': { metric: 'weight' },
  'Squat Clean': { metric: 'weight' },
  'Clean and Jerk': { metric: 'weight' },
  'Hang Power Clean': { metric: 'weight' },
  'Bench Press': { metric: 'weight' },
  'Front Squat': { metric: 'weight' },
  'Back Squat': { metric: 'weight' },
  'Overhead Squat': { metric: 'weight' },
  'Push Press': { metric: 'weight' },
  'Strict Press': { metric: 'weight' },
  'Thruster': { metric: 'weight' },
  'Power Snatch': { metric: 'weight' },
  'Hang Power Snatch': { metric: 'weight' },
  'Snatch': { metric: 'weight' },
  'Back Lunges': { metric: 'weight' },
  // Bodyweight — reps
  'Push Up': { metric: 'reps' },
  'Pull Up': { metric: 'reps' },
  'Handstand Push Up': { metric: 'reps' },
  'Muscle Up': { metric: 'reps' },
  'Ring Dip': { metric: 'reps' },
  'Toes to Bar': { metric: 'reps' },
  'Sit Up': { metric: 'reps' },
  'Air Squat': { metric: 'reps' },
  'Burpee': { metric: 'reps' },
  'Box Jump': { metric: 'reps' },
  'Double Under': { metric: 'reps' },
}

export function getExerciseMetric(name: ExerciseName): ExerciseMetric {
  return EXERCISE_DEFINITIONS[name].metric
}

export interface WeightEntry {
  _id: string
  weight?: number
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
  isFallback?: boolean  // true = no entries in last 7 days; weightHistory has all-time PR at today's date
}

export function getMaxValue(exercise: Exercise): number | undefined {
  if (!exercise.weightHistory?.length) return undefined
  const metric = getExerciseMetric(exercise.name)
  if (metric === 'reps') {
    const values = exercise.weightHistory.map((e) => e.reps).filter((v): v is number => v != null)
    return values.length ? Math.max(...values) : undefined
  }
  const values = exercise.weightHistory.map((e) => e.weight).filter((v): v is number => v != null)
  return values.length ? Math.max(...values) : undefined
}

export interface LogWeightData {
  name: ExerciseName
  weight?: number
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
