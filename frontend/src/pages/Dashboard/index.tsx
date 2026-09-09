import { Box, Container, Typography } from '@mui/material'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { EXERCISE_NAMES, type ExerciseName } from '../../types/exercise'
import AnalyticsChart from './AnalyticsChart'
import { selectedExerciseAtom, periodAtom } from './atoms'
import { PERIOD_OPTIONS, type Period } from './ChartFilters/PeriodSelector'
import ChartFilters from './ChartFilters'

const EXERCISE_NAME_SET: ReadonlySet<string> = new Set(EXERCISE_NAMES)
const PERIOD_SET: ReadonlySet<number> = new Set(PERIOD_OPTIONS)

export default function Dashboard() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const setSelectedExercise = useSetAtom(selectedExerciseAtom)
  const setPeriod = useSetAtom(periodAtom)

  useEffect(() => {
    const exerciseParam = searchParams.get('exercise')
    if (exerciseParam && EXERCISE_NAME_SET.has(exerciseParam)) {
      setSelectedExercise(exerciseParam as ExerciseName)
    }

    const periodParam = Number(searchParams.get('period'))
    if (PERIOD_SET.has(periodParam)) {
      setPeriod(periodParam as Period)
    }
  }, [searchParams, setSelectedExercise, setPeriod])

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <ChartFilters />
          <AnalyticsChart />
        </Box>
      </Box>
    </Container>
  )
}
