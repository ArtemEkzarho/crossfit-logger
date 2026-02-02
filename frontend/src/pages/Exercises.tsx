import { Add, Delete, Edit } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import {
  useCreateExercise,
  useDeleteExercise,
  useExercises,
  useUpdateExercise,
} from '../hooks/useExercises'
import type { CreateExerciseData, Exercise } from '../types/exercise'

interface ExerciseFormData {
  name: string
  weight: string
  reps: string
  sets: string
  notes: string
  date: string
}

const emptyForm: ExerciseFormData = {
  name: '',
  weight: '',
  reps: '',
  sets: '',
  notes: '',
  date: new Date().toISOString().split('T')[0],
}

export default function Exercises() {
  const { data: exercises, isLoading, error } = useExercises()
  const createExercise = useCreateExercise()
  const updateExercise = useUpdateExercise()
  const deleteExerciseMutation = useDeleteExercise()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null)
  const [formData, setFormData] = useState<ExerciseFormData>(emptyForm)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleOpenCreate = () => {
    setEditingExercise(null)
    setFormData(emptyForm)
    setFormOpen(true)
  }

  const handleOpenEdit = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setFormData({
      name: exercise.name,
      weight: exercise.weight?.toString() || '',
      reps: exercise.reps?.toString() || '',
      sets: exercise.sets?.toString() || '',
      notes: exercise.notes || '',
      date: new Date(exercise.date).toISOString().split('T')[0],
    })
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingExercise(null)
    setFormData(emptyForm)
  }

  const handleOpenDelete = (exercise: Exercise) => {
    setExerciseToDelete(exercise)
    setDeleteDialogOpen(true)
  }

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false)
    setExerciseToDelete(null)
  }

  const handleFormChange = (field: keyof ExerciseFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    const data: CreateExerciseData = {
      name: formData.name,
      weight: formData.weight ? Number(formData.weight) : undefined,
      reps: formData.reps ? Number(formData.reps) : undefined,
      sets: formData.sets ? Number(formData.sets) : undefined,
      notes: formData.notes || undefined,
      date: formData.date,
    }

    try {
      if (editingExercise) {
        await updateExercise.mutateAsync({ id: editingExercise._id, data })
        setSnackbar({ open: true, message: 'Exercise updated successfully', severity: 'success' })
      } else {
        await createExercise.mutateAsync(data)
        setSnackbar({ open: true, message: 'Exercise created successfully', severity: 'success' })
      }
      handleCloseForm()
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'An error occurred',
        severity: 'error',
      })
    }
  }

  const handleDelete = async () => {
    if (!exerciseToDelete) return

    try {
      await deleteExerciseMutation.mutateAsync(exerciseToDelete._id)
      setSnackbar({ open: true, message: 'Exercise deleted successfully', severity: 'success' })
      handleCloseDelete()
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'An error occurred',
        severity: 'error',
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Failed to load exercises: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Exercises
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track and manage your workout exercises.
        </Typography>

        {exercises && exercises.length > 0 ? (
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
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(exercise)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDelete(exercise)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No exercises yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start tracking your workouts by adding your first exercise.
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
              Add Exercise
            </Button>
          </Paper>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={handleOpenCreate}
        >
          <Add />
        </Fab>

        {/* Create/Edit Dialog */}
        <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
          <DialogTitle>{editingExercise ? 'Edit Exercise' : 'Add Exercise'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Exercise Name"
                value={formData.name}
                onChange={handleFormChange('name')}
                required
                fullWidth
              />
              <TextField
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleFormChange('weight')}
                fullWidth
              />
              <TextField
                label="Reps"
                type="number"
                value={formData.reps}
                onChange={handleFormChange('reps')}
                fullWidth
              />
              <TextField
                label="Sets"
                type="number"
                value={formData.sets}
                onChange={handleFormChange('sets')}
                fullWidth
              />
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={handleFormChange('notes')}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleFormChange('date')}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.name || createExercise.isPending || updateExercise.isPending}
            >
              {createExercise.isPending || updateExercise.isPending
                ? 'Saving...'
                : editingExercise
                  ? 'Update'
                  : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
          <DialogTitle>Delete Exercise</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{exerciseToDelete?.name}"? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteExerciseMutation.isPending}
            >
              {deleteExerciseMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  )
}
