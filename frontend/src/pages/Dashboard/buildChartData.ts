import type { Exercise, ExerciseMetric, ExerciseName } from '../../types/exercise'
import { getExerciseMetric } from '../../types/exercise'

export interface ChartData {
  data: Record<string, string | number>[]
  users: string[]
  metric: ExerciseMetric
  fallbackUsers: Set<string>
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function buildChartData(exercises: Exercise[], selectedExercise: ExerciseName): ChartData {
  const metric = getExerciseMetric(selectedExercise)
  const users = [...new Set(exercises.map((e) => e.userName || 'Unknown'))]
  const fallbackUsers = new Set(
    exercises.filter((e) => e.isFallback).map((e) => e.userName || 'Unknown')
  )

  const dateMap = new Map<string, Record<string, string | number>>()

  exercises.forEach((exercise) => {
    const userName = exercise.userName || 'Unknown'
    ;(exercise.weightHistory ?? []).forEach((entry) => {
      const entryValue = metric === 'reps' ? entry.reps : entry.weight
      if (entryValue == null) return

      const dateKey = entry.date.split('T')[0]
      const existing = dateMap.get(dateKey) || { date: formatDate(entry.date) }

      const current = existing[userName] as number | undefined
      if (!current || entryValue > current) {
        existing[userName] = entryValue
      }

      dateMap.set(dateKey, existing)
    })
  })

  const data = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value)

  return { data, users, metric, fallbackUsers }
}

export const EMPTY_CHART_DATA: ChartData = {
  data: [],
  users: [],
  metric: 'weight',
  fallbackUsers: new Set(),
}
