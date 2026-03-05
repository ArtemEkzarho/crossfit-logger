import { Box } from '@mui/material'
import ExerciseSelector from './ExerciseSelector'
import PeriodSelector from './PeriodSelector'

export default function ChartFilters() {
  return (
    <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
      <ExerciseSelector />
      <PeriodSelector />
    </Box>
  )
}
