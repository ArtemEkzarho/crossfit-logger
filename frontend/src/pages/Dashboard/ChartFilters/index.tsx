import { Stack } from '@mui/material'
import ExerciseSelector from './ExerciseSelector'
import PeriodSelector from './PeriodSelector'

export default function ChartFilters() {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
      <ExerciseSelector />
      <PeriodSelector />
    </Stack>
  )
}
