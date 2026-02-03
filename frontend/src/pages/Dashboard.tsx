import { Alert, Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import type { Exercise } from '../types/exercise'

const COLORS = {
  Deadlift: '#8884d8',
  'Power Clean': '#82ca9d',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getExerciseFrequencyData(exercises: Exercise[]) {
  const frequencyMap = new Map<string, number>()

  exercises.forEach((exercise) => {
    const count = frequencyMap.get(exercise.name) || 0
    frequencyMap.set(exercise.name, count + 1)
  })

  return Array.from(frequencyMap.entries()).map(([name, count]) => ({
    name,
    count,
    fill: COLORS[name as keyof typeof COLORS] || '#8884d8',
  }))
}

function getWeightProgressionData(exercises: Exercise[]) {
  const sortedExercises = [...exercises].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const dateMap = new Map<string, { date: string; Deadlift?: number; 'Power Clean'?: number }>()

  sortedExercises.forEach((exercise) => {
    const dateKey = exercise.date.split('T')[0]
    const existing = dateMap.get(dateKey) || { date: formatDate(exercise.date) }

    if (exercise.weight) {
      const currentWeight = existing[exercise.name as keyof typeof COLORS]
      if (!currentWeight || exercise.weight > currentWeight) {
        existing[exercise.name as keyof typeof COLORS] = exercise.weight
      }
    }

    dateMap.set(dateKey, existing)
  })

  return Array.from(dateMap.values())
}

function getVolumeData(exercises: Exercise[]) {
  const sortedExercises = [...exercises].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const dateMap = new Map<string, { date: string; Deadlift?: number; 'Power Clean'?: number }>()

  sortedExercises.forEach((exercise) => {
    const dateKey = exercise.date.split('T')[0]
    const existing = dateMap.get(dateKey) || { date: formatDate(exercise.date) }

    const volume = (exercise.sets || 1) * (exercise.reps || 1)
    const currentVolume = existing[exercise.name as keyof typeof COLORS] || 0
    existing[exercise.name as keyof typeof COLORS] = currentVolume + volume

    dateMap.set(dateKey, existing)
  })

  return Array.from(dateMap.values())
}

export default function Dashboard() {
  const { data: exercises, isLoading, error } = useAllExercisesForAnalytics()

  const frequencyData = useMemo(
    () => (exercises ? getExerciseFrequencyData(exercises) : []),
    [exercises]
  )

  const weightProgressionData = useMemo(
    () => (exercises ? getWeightProgressionData(exercises) : []),
    [exercises]
  )

  const volumeData = useMemo(() => (exercises ? getVolumeData(exercises) : []), [exercises])

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

  const totalExercises = exercises?.length || 0

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Exercise analytics across all users ({totalExercises} total exercises logged)
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: 400 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Exercise Frequency
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  How often each exercise is performed
                </Typography>
                {frequencyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={frequencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Times Performed" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}
                  >
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: 400 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Weight Progression
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Maximum weight lifted over time (kg)
                </Typography>
                {weightProgressionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={weightProgressionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Deadlift"
                        stroke={COLORS.Deadlift}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="Power Clean"
                        stroke={COLORS['Power Clean']}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}
                  >
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card sx={{ height: 400 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Volume Trends
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Total volume (sets x reps) over time
                </Typography>
                {volumeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Deadlift"
                        stackId="1"
                        stroke={COLORS.Deadlift}
                        fill={COLORS.Deadlift}
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="Power Clean"
                        stackId="1"
                        stroke={COLORS['Power Clean']}
                        fill={COLORS['Power Clean']}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}
                  >
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
