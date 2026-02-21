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
import { useAllExercisesForAnalytics } from '../hooks/useExercises'
import type { Exercise, ExerciseName } from '../types/exercise'
import { EXERCISE_NAMES } from '../types/exercise'

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
  const filtered = exercises
    .filter((e) => e.name === selectedExercise && e.weight != null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const userNames = [...new Set(filtered.map((e) => e.userName || 'Unknown'))]

  const dateMap = new Map<string, Record<string, string | number>>()

  filtered.forEach((exercise) => {
    const dateKey = exercise.date.split('T')[0]
    const existing = dateMap.get(dateKey) || { date: formatDate(exercise.date) }
    const name = exercise.userName || 'Unknown'

    const current = existing[name] as number | undefined
    if (!current || exercise.weight! > current) {
      existing[name] = exercise.weight!
    }

    dateMap.set(dateKey, existing)
  })

  const data = Array.from(dateMap.values())

  return { data, users: userNames }
}

export default function Dashboard() {
  const { data: exercises, isLoading, error } = useAllExercisesForAnalytics()
  const [selectedExercise, setSelectedExercise] = useState<ExerciseName>(EXERCISE_NAMES[0])

  const { data: chartData, users } = useMemo(
    () => (exercises ? buildChartData(exercises, selectedExercise) : { data: [], users: [] }),
    [exercises, selectedExercise]
  )

  const handleToggle = (_: React.MouseEvent, value: ExerciseName | null) => {
    if (value) {
      setSelectedExercise(value)
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
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
        <Typography variant="body1" color="text.secondary" paragraph>
          Max weight progression per user
        </Typography>

        <Paper sx={{ p: 3 }}>
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
            <Typography variant="h6">{selectedExercise} — Max Weight (kg)</Typography>
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

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit=" kg" />
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
