import { Add } from '@mui/icons-material'
import { Alert, Box, CircularProgress, Container, Fab, Snackbar, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import {
  useCreateExercise,
  useDeleteExercise,
  useExercises,
  useUpdateExercise,
} from '../../hooks/useExercises'
import type { CreateExerciseData, Exercise, ExerciseName } from '../../types/exercise'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import ExerciseFormDialog, { emptyForm, type ExerciseFormData } from './ExerciseFormDialog'
import ExercisesTable from './ExercisesTable'

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

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({ ...prev, name: e.target.value as ExerciseName }))
  }

  const handleSubmit = async () => {
    if (!formData.name) return

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

        <ExercisesTable
          exercises={exercises ?? []}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onCreate={handleOpenCreate}
        />

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={handleOpenCreate}
        >
          <Add />
        </Fab>

        <ExerciseFormDialog
          open={formOpen}
          isEditing={!!editingExercise}
          isSaving={createExercise.isPending || updateExercise.isPending}
          formData={formData}
          onFormChange={handleFormChange}
          onSelectChange={handleSelectChange}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          exercise={exerciseToDelete}
          isDeleting={deleteExerciseMutation.isPending}
          onConfirm={handleDelete}
          onClose={handleCloseDelete}
        />

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
