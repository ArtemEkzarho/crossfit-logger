import { Add, ChevronRight } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import type { Exercise } from '../../types/exercise'
import { getExerciseMetric, getMaxValue } from '../../types/exercise'

interface ExercisesTableProps {
  exercises: Exercise[]
  onNavigate: (name: string) => void
  onCreate: () => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

export default function ExercisesTable({ exercises, onNavigate, onCreate }: ExercisesTableProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (exercises.length === 0) {
    return (
      <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No exercises yet
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Start tracking your workouts by logging your first entry.
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
          Log Entry
        </Button>
      </Paper>
    )
  }

  if (isMobile) {
    return (
      <Stack spacing={2} mt={3}>
        {exercises.map((exercise) => {
          const maxValue = getMaxValue(exercise)
          const metric = getExerciseMetric(exercise.name)
          const lastEntry = exercise.weightHistory?.[exercise.weightHistory.length - 1]
          return (
            <Card key={exercise._id}>
              <CardActionArea onClick={() => onNavigate(exercise.name)}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">{exercise.name}</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                        {maxValue != null && (
                          <Chip
                            label={`${maxValue} ${metric === 'reps' ? 'reps' : 'kg'}`}
                            size="small"
                            color="primary"
                          />
                        )}
                        {lastEntry && (
                          <Chip
                            label={formatDate(lastEntry.date)}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          label={`${exercise.weightHistory.length} entries`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <ChevronRight color="action" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        })}
      </Stack>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Exercise</TableCell>
            <TableCell align="right">Best</TableCell>
            <TableCell align="right">Entries</TableCell>
            <TableCell>Last Logged</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises.map((exercise) => {
            const maxValue = getMaxValue(exercise)
            const metric = getExerciseMetric(exercise.name)
            const lastEntry = exercise.weightHistory?.[exercise.weightHistory.length - 1]
            return (
              <TableRow
                key={exercise._id}
                hover
                onClick={() => onNavigate(exercise.name)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">
                  <Typography fontWeight={500}>{exercise.name}</Typography>
                </TableCell>
                <TableCell align="right">
                  {maxValue != null ? (
                    <Typography fontWeight={700} color="primary">
                      {maxValue} {metric === 'reps' ? 'reps' : 'kg'}
                    </Typography>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell align="right">{exercise.weightHistory.length}</TableCell>
                <TableCell>{lastEntry ? formatDate(lastEntry.date) : '—'}</TableCell>
                <TableCell align="right">
                  <ChevronRight color="action" />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
