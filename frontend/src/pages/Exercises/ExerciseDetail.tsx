import { Alert, Box, CircularProgress, Container, Divider, Snackbar, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteWeightEntry,
  useExercise,
  useLogWeight,
  useUpdateWeightEntry,
} from '../../hooks/useExercises'
import type { ExerciseName, UpdateWeightEntryData, WeightEntry } from '../../types/exercise'
import { getExerciseMetric, getMaxValue } from '../../types/exercise'
import ExerciseFormDialog, { emptyForm, type ExerciseFormData } from './ExerciseFormDialog'
import DeleteEntryDialog from './ExerciseDetail/DeleteEntryDialog'
import EditEntryDialog, { type EditEntryState } from './ExerciseDetail/EditEntryDialog'
import ExerciseDetailHeader from './ExerciseDetail/ExerciseDetailHeader'
import WeightHistory from './ExerciseDetail/WeightHistory'

export default function ExerciseDetail() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()

  const decodedName = decodeURIComponent(name ?? '')
  const { data: exercise, isLoading, error } = useExercise(decodedName)
  const logWeight = useLogWeight()
  const updateEntry = useUpdateWeightEntry()
  const deleteEntry = useDeleteWeightEntry()

  const [logFormOpen, setLogFormOpen] = useState(false)
  const [logFormData, setLogFormData] = useState<ExerciseFormData>({
    ...emptyForm,
    name: decodedName as ExerciseName,
  })
  const [editEntry, setEditEntry] = useState<EditEntryState | null>(null)
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const showSnackbar = (message: string, severity: 'success' | 'error') =>
    setSnackbar({ open: true, message, severity })

  const handleLogFormChange =
    (field: keyof ExerciseFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setLogFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleLogSelectChange = (e: SelectChangeEvent) =>
    setLogFormData((prev) => ({ ...prev, name: e.target.value as ExerciseName }))

  const handleLogSubmit = async () => {
    if (!logFormData.name) return
    const metric = getExerciseMetric(logFormData.name)
    if (metric === 'weight' && !logFormData.weight) return
    if (metric === 'reps' && !logFormData.reps) return

    try {
      await logWeight.mutateAsync({
        name: logFormData.name,
        weight: metric === 'weight' ? Number(logFormData.weight) : undefined,
        reps: logFormData.reps ? Number(logFormData.reps) : undefined,
        sets: logFormData.sets ? Number(logFormData.sets) : undefined,
        notes: logFormData.notes || undefined,
        date: logFormData.date,
      })
      showSnackbar('Entry logged', 'success')
      setLogFormOpen(false)
      setLogFormData({ ...emptyForm, name: decodedName as ExerciseName })
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'An error occurred', 'error')
    }
  }

  const handleOpenEdit = (entry: WeightEntry) => {
    setEditEntry({
      entryId: entry._id,
      weight: entry.weight?.toString() ?? '',
      reps: entry.reps?.toString() ?? '',
      sets: entry.sets?.toString() ?? '',
      notes: entry.notes ?? '',
      date: new Date(entry.date).toISOString().split('T')[0],
    })
  }

  const handleEditChange = (
    field: keyof Omit<EditEntryState, 'entryId'>,
    value: string
  ) => setEditEntry((prev) => prev && { ...prev, [field]: value })

  const handleEditSubmit = async () => {
    if (!editEntry) return
    const metric = getExerciseMetric(decodedName as ExerciseName)
    const data: UpdateWeightEntryData = {
      weight: metric === 'weight' && editEntry.weight ? Number(editEntry.weight) : undefined,
      reps: editEntry.reps ? Number(editEntry.reps) : undefined,
      sets: editEntry.sets ? Number(editEntry.sets) : undefined,
      notes: editEntry.notes || undefined,
      date: editEntry.date,
    }
    try {
      await updateEntry.mutateAsync({ name: decodedName, entryId: editEntry.entryId, data })
      showSnackbar('Entry updated', 'success')
      setEditEntry(null)
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'An error occurred', 'error')
    }
  }

  const handleDeleteEntry = async () => {
    if (!deleteEntryId) return
    try {
      await deleteEntry.mutateAsync({ name: decodedName, entryId: deleteEntryId })
      showSnackbar('Entry deleted', 'success')
      setDeleteEntryId(null)
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'An error occurred', 'error')
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

  if (error || !exercise) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <ExerciseDetailHeader
            name={decodedName}
            maxValue={undefined}
            metric="weight"
            onBack={() => navigate('/exercises')}
            onLogWeight={() => {}}
          />
          <Alert severity="error">
            {error instanceof Error ? error.message : 'Exercise not found'}
          </Alert>
        </Box>
      </Container>
    )
  }

  const metric = getExerciseMetric(exercise.name)
  const maxValue = getMaxValue(exercise)
  const sortedHistory = [...(exercise.weightHistory ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <ExerciseDetailHeader
          name={exercise.name}
          maxValue={maxValue}
          metric={metric}
          onBack={() => navigate('/exercises')}
          onLogWeight={() => {
            setLogFormData({ ...emptyForm, name: decodedName as ExerciseName })
            setLogFormOpen(true)
          }}
        />

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" gutterBottom>
          History
        </Typography>

        <WeightHistory
          entries={sortedHistory}
          maxValue={maxValue}
          metric={metric}
          onEdit={handleOpenEdit}
          onDelete={setDeleteEntryId}
        />
      </Box>

      <ExerciseFormDialog
        open={logFormOpen}
        isSaving={logWeight.isPending}
        formData={logFormData}
        lockedName={decodedName as ExerciseName}
        onFormChange={handleLogFormChange}
        onSelectChange={handleLogSelectChange}
        onSubmit={handleLogSubmit}
        onClose={() => setLogFormOpen(false)}
      />

      <EditEntryDialog
        open={!!editEntry}
        editEntry={editEntry}
        isSaving={updateEntry.isPending}
        metric={metric}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        onClose={() => setEditEntry(null)}
      />

      <DeleteEntryDialog
        open={!!deleteEntryId}
        isDeleting={deleteEntry.isPending}
        onConfirm={handleDeleteEntry}
        onClose={() => setDeleteEntryId(null)}
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
    </Container>
  )
}
