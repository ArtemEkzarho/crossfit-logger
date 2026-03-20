import { Box, CircularProgress, Typography } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useExerciseAnalytics } from '../../hooks/useExercises'
import { periodAtom, selectedExerciseAtom } from './atoms'
import { buildChartData, EMPTY_CHART_DATA } from './buildChartData'
import { USER_COLORS } from './userColors'

export default function AnalyticsChart() {
  const { t } = useTranslation()
  const selectedExercise = useAtomValue(selectedExerciseAtom)
  const period = useAtomValue(periodAtom)
  const { data: exercises, isLoading } = useExerciseAnalytics(selectedExercise, period)

  const chartData = useMemo(
    () => (exercises ? buildChartData(exercises, selectedExercise) : EMPTY_CHART_DATA),
    [exercises, selectedExercise]
  )

  const { data, users, metric, fallbackUsers } = chartData

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={400}>
        <CircularProgress />
      </Box>
    )
  }

  if (data.length === 0) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={400}>
        <Typography color="text.secondary">{t('dashboard.noData')}</Typography>
      </Box>
    )
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit={metric === 'reps' ? t('dashboard.unit.reps') : t('dashboard.unit.kg')} />
          <Tooltip />
          <Legend />
          {users.map((user, i) => {
            const color = USER_COLORS[i % USER_COLORS.length]
            const isFallback = fallbackUsers.has(user)
            return (
              <Line
                key={user}
                type="monotone"
                dataKey={user}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={isFallback ? '5 5' : undefined}
                dot={isFallback ? { r: 5, fill: 'white', strokeWidth: 2, stroke: color } : { r: 4 }}
                connectNulls
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
      {period >= 30 && (
        <Typography variant="caption" color="text.secondary" mt={1} display="block">
          {t('dashboard.weeklyNote')}
        </Typography>
      )}
      {fallbackUsers.size > 0 && (
        <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
          {t('dashboard.prNote')}
        </Typography>
      )}
    </>
  )
}
