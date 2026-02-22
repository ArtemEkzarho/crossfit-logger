import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
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
import { useExerciseAnalytics } from '../hooks/useExercises'
import type { Exercise, ExerciseName } from '../types/exercise'
import { EXERCISE_NAMES, getExerciseMetric } from '../types/exercise'

const USER_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ff7c43',
  '#ffc658',
  '#0088fe',
  '#00c49f',
  '#ff8042',
  '#a4de6c',
  '#d0ed57',
  '#8dd1e1',
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function buildChartData(exercises: Exercise[], selectedExercise: ExerciseName) {
  const metric = getExerciseMetric(selectedExercise)
  const userNames = [...new Set(exercises.map((e) => e.userName || 'Unknown'))]

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

  return { data, users: userNames, metric }
}

export default function Dashboard() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseName>(EXERCISE_NAMES[0])
  const { data: exercises, isLoading, error } = useExerciseAnalytics(selectedExercise)

  const { data: chartData, users, metric } = useMemo(
    () => (exercises ? buildChartData(exercises, selectedExercise) : { data: [], users: [], metric: 'weight' as const }),
    [exercises, selectedExercise]
  )

  const handleToggle = (_: React.MouseEvent, value: ExerciseName | null) => {
    if (value) {
      setSelectedExercise(value)
    }
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">Failed to load analytics: {error.message}</Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Max progression per user
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6">
              {selectedExercise} — {metric === 'reps' ? 'Max Reps' : 'Max Weight (kg)'}
            </Typography>
            <ToggleButtonGroup
              value={selectedExercise}
              exclusive
              onChange={handleToggle}
              size="small"
            >
              {EXERCISE_NAMES.map((name) => (
                <ToggleButton key={name} value={name} sx={{ textTransform: 'none' }}>
                  {name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
              <CircularProgress />
            </Box>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit={metric === 'reps' ? ' reps' : ' kg'} />
                <Tooltip />
                <Legend />
                {users.map((user, i) => (
                  <Line
                    key={user}
                    type="monotone"
                    dataKey={user}
                    stroke={USER_COLORS[i % USER_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}
            >
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}
