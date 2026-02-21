import { Add, Delete, Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
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

interface ExercisesTableProps {
  exercises: Exercise[]
  onEdit: (exercise: Exercise) => void
  onDelete: (exercise: Exercise) => void
  onCreate: () => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

export default function ExercisesTable({ exercises, onEdit, onDelete, onCreate }: ExercisesTableProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (exercises.length === 0) {
    return (
      <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No exercises yet
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Start tracking your workouts by adding your first exercise.
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
          Add Exercise
        </Button>
      </Paper>
    )
  }

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ mt: 3 }}>
        {exercises.map((exercise) => (
          <Card key={exercise._id}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">{exercise.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(exercise.date)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {exercise.weight != null && (
                  <Chip label={`${exercise.weight} kg`} size="small" variant="outlined" />
                )}
                {exercise.reps != null && (
                  <Chip label={`${exercise.reps} reps`} size="small" variant="outlined" />
                )}
                {exercise.sets != null && (
                  <Chip label={`${exercise.sets} sets`} size="small" variant="outlined" />
                )}
              </Box>
              {exercise.notes && (
                <Typography variant="body2" color="text.secondary">
                  {exercise.notes}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <IconButton color="primary" onClick={() => onEdit(exercise)} size="small">
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(exercise)} size="small">
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Stack>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Weight (kg)</TableCell>
            <TableCell align="right">Reps</TableCell>
            <TableCell align="right">Sets</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises.map((exercise) => (
            <TableRow key={exercise._id} hover>
              <TableCell component="th" scope="row">
                {exercise.name}
              </TableCell>
              <TableCell align="right">{exercise.weight ?? '-'}</TableCell>
              <TableCell align="right">{exercise.reps ?? '-'}</TableCell>
              <TableCell align="right">{exercise.sets ?? '-'}</TableCell>
              <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {exercise.notes || '-'}
              </TableCell>
              <TableCell>{formatDate(exercise.date)}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(exercise)} size="small">
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(exercise)} size="small">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
