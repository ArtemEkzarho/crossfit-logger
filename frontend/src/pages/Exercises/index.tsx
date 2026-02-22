import { Add } from '@mui/icons-material'
import { Alert, Box, CircularProgress, Container, Fab, Snackbar, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExercises, useLogWeight } from '../../hooks/useExercises'
import type { ExerciseName } from '../../types/exercise'
import ExerciseFormDialog, { emptyForm, type ExerciseFormData } from './ExerciseFormDialog'
import ExercisesTable from './ExercisesTable'

export default function Exercises() {
  const navigate = useNavigate()
  const { data: exercises, isLoading, error } = useExercises()
  const logWeight = useLogWeight()

  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<ExerciseFormData>(emptyForm)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleOpenCreate = () => {
    setFormData(emptyForm)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setFormData(emptyForm)
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
    if (!formData.name || !formData.weight) return

    try {
      await logWeight.mutateAsync({
        name: formData.name,
        weight: Number(formData.weight),
        reps: formData.reps ? Number(formData.reps) : undefined,
        sets: formData.sets ? Number(formData.sets) : undefined,
        notes: formData.notes || undefined,
        date: formData.date,
      })
      setSnackbar({ open: true, message: 'Weight logged successfully', severity: 'success' })
      handleCloseForm()
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
          onNavigate={(name) => navigate(`/exercises/${encodeURIComponent(name)}`)}
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
          isSaving={logWeight.isPending}
          formData={formData}
          onFormChange={handleFormChange}
          onSelectChange={handleSelectChange}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
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
