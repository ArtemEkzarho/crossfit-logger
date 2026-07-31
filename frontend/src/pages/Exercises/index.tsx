import { Add } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteExercise, useExercises, useLogWeight } from '../../api/hooks/useExercises'
import { useAppNavigation } from '../../hooks/useAppNavigation'
import type { Exercise, ExerciseName } from '../../types/exercise'
import { getExerciseMetric } from '../../types/exercise'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import ExerciseFormDialog, { emptyForm, type ExerciseFormData } from './ExerciseFormDialog'
import ExercisesTable from './ExercisesTable'

export default function Exercises() {
  const { goTo, localePath } = useAppNavigation()
  const { data: exercises, isLoading, error } = useExercises()
  const logWeight = useLogWeight()
  const deleteExercise = useDeleteExercise()
  const { t } = useTranslation()

  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<ExerciseFormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
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

  const handleFormChange =
    (field: keyof ExerciseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({ ...prev, name: e.target.value as ExerciseName }))
  }

  const handleSubmit = async () => {
    if (!formData.name) return
    const metric = getExerciseMetric(formData.name)
    if (metric === 'weight' && !formData.weight) return
    if (metric === 'reps' && !formData.reps) return

    try {
      await logWeight.mutateAsync({
        name: formData.name,
        weight: metric === 'weight' ? Number(formData.weight) : undefined,
        reps: formData.reps ? Number(formData.reps) : undefined,
        sets: formData.sets ? Number(formData.sets) : undefined,
        notes: formData.notes || undefined,
        date: formData.date,
      })
      setSnackbar({ open: true, message: t('exercises.successLogged'), severity: 'success' })
      handleCloseForm()
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'An error occurred',
        severity: 'error',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteExercise.mutateAsync(deleteTarget.name)
      setSnackbar({ open: true, message: t('exercises.successDeleted'), severity: 'success' })
      setDeleteTarget(null)
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
            {t('exercises.error', {
              message: error instanceof Error ? error.message : 'Unknown error',
            })}
          </Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}
        >
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {t('exercises.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('exercises.subtitle')}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            {t('exercises.addButton')}
          </Button>
        </Stack>

        <ExercisesTable
          exercises={exercises ?? []}
          onNavigate={(name) => goTo(localePath(`/exercises/${encodeURIComponent(name)}`))}
          onCreate={handleOpenCreate}
          onDelete={setDeleteTarget}
        />

        <ExerciseFormDialog
          open={formOpen}
          isSaving={logWeight.isPending}
          formData={formData}
          onFormChange={handleFormChange}
          onSelectChange={handleSelectChange}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />

        <DeleteConfirmDialog
          open={!!deleteTarget}
          exercise={deleteTarget}
          isDeleting={deleteExercise.isPending}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  )
}
