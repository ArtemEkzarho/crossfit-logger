import { atom } from 'jotai'
import type { ExerciseName } from '../../types/exercise'
import { EXERCISE_NAMES } from '../../types/exercise'
import type { Period } from './ChartFilters/PeriodSelector'

export const selectedExerciseAtom = atom<ExerciseName>(EXERCISE_NAMES[0])
export const periodAtom = atom<Period>(90)
