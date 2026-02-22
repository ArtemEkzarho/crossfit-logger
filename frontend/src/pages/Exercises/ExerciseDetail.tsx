import { ArrowBack, Delete, Edit } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
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
import { getMaxWeight } from '../../types/exercise'
import ExerciseFormDialog, { emptyForm, type ExerciseFormData } from './ExerciseFormDialog'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

interface EditEntryState {
  entryId: string
  weight: string
  reps: string
  sets: string
  notes: string
  date: string
}

export default function ExerciseDetail() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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

  // Log new weight
  const handleLogFormChange =
    (field: keyof ExerciseFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setLogFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleLogSelectChange = (e: SelectChangeEvent) =>
    setLogFormData((prev) => ({ ...prev, name: e.target.value as ExerciseName }))

  const handleLogSubmit = async () => {
    if (!logFormData.name || !logFormData.weight) return
    try {
      await logWeight.mutateAsync({
        name: logFormData.name,
        weight: Number(logFormData.weight),
        reps: logFormData.reps ? Number(logFormData.reps) : undefined,
        sets: logFormData.sets ? Number(logFormData.sets) : undefined,
        notes: logFormData.notes || undefined,
        date: logFormData.date,
      })
      showSnackbar('Weight logged', 'success')
      setLogFormOpen(false)
      setLogFormData({ ...emptyForm, name: decodedName as ExerciseName })
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'An error occurred', 'error')
    }
  }

  // Edit entry
  const openEditEntry = (entry: WeightEntry) => {
    setEditEntry({
      entryId: entry._id,
      weight: entry.weight.toString(),
      reps: entry.reps?.toString() ?? '',
      sets: entry.sets?.toString() ?? '',
      notes: entry.notes ?? '',
      date: new Date(entry.date).toISOString().split('T')[0],
    })
  }

  const handleEditSubmit = async () => {
    if (!editEntry) return
    const data: UpdateWeightEntryData = {
      weight: Number(editEntry.weight),
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

  // Delete entry
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
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/exercises')} sx={{ mb: 2 }}>
            Back to Exercises
          </Button>
          <Alert severity="error">
            {error instanceof Error ? error.message : 'Exercise not found'}
          </Alert>
        </Box>
      </Container>
    )
  }

  const maxWeight = getMaxWeight(exercise)
  const sortedHistory = [...(exercise.weightHistory ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header */}
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/exercises')} sx={{ mb: 2 }}>
          Back to Exercises
        </Button>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" component="h1">
              {exercise.name}
            </Typography>
            {maxWeight != null && (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                <Typography variant="h2" color="primary" fontWeight={700}>
                  {maxWeight}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  kg
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  personal best
                </Typography>
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setLogFormData({ ...emptyForm, name: decodedName as ExerciseName })
              setLogFormOpen(true)
            }}
          >
            Log Weight
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Weight history */}
        <Typography variant="h5" gutterBottom>
          Weight History
        </Typography>

        {sortedHistory.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No entries yet. Log your first weight!</Typography>
          </Paper>
        ) : isMobile ? (
          <Stack spacing={2}>
            {sortedHistory.map((entry) => (
              <Card key={entry._id}>
                <CardContent sx={{ pb: '12px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="h6" fontWeight={700}>
                          {entry.weight}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          kg
                        </Typography>
                        {entry.weight === maxWeight && (
                          <Chip label="PR" size="small" color="primary" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(entry.date)}
                        </Typography>
                        {entry.reps != null && (
                          <Typography variant="body2" color="text.secondary">
                            · {entry.reps} reps
                          </Typography>
                        )}
                        {entry.sets != null && (
                          <Typography variant="body2" color="text.secondary">
                            · {entry.sets} sets
                          </Typography>
                        )}
                      </Box>
                      {entry.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {entry.notes}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditEntry(entry)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteEntryId(entry._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Weight (kg)</TableCell>
                  <TableCell align="right">Reps</TableCell>
                  <TableCell align="right">Sets</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedHistory.map((entry) => (
                  <TableRow key={entry._id} hover>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Typography fontWeight={entry.weight === maxWeight ? 700 : 400}>
                          {entry.weight}
                        </Typography>
                        {entry.weight === maxWeight && (
                          <Chip label="PR" size="small" color="primary" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{entry.reps ?? '—'}</TableCell>
                    <TableCell align="right">{entry.sets ?? '—'}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.notes || '—'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditEntry(entry)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteEntryId(entry._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Log weight dialog */}
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

      {/* Edit entry dialog */}
      <Dialog open={!!editEntry} onClose={() => setEditEntry(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Weight (kg)"
              type="number"
              value={editEntry?.weight ?? ''}
              onChange={(e) => setEditEntry((prev) => prev && { ...prev, weight: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Reps"
              type="number"
              value={editEntry?.reps ?? ''}
              onChange={(e) => setEditEntry((prev) => prev && { ...prev, reps: e.target.value })}
              fullWidth
            />
            <TextField
              label="Sets"
              type="number"
              value={editEntry?.sets ?? ''}
              onChange={(e) => setEditEntry((prev) => prev && { ...prev, sets: e.target.value })}
              fullWidth
            />
            <TextField
              label="Notes"
              value={editEntry?.notes ?? ''}
              onChange={(e) => setEditEntry((prev) => prev && { ...prev, notes: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={editEntry?.date ?? ''}
              onChange={(e) => setEditEntry((prev) => prev && { ...prev, date: e.target.value })}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditEntry(null)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!editEntry?.weight || updateEntry.isPending}
          >
            {updateEntry.isPending ? 'Saving...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete entry confirmation */}
      <Dialog open={!!deleteEntryId} onClose={() => setDeleteEntryId(null)}>
        <DialogTitle>Delete Entry</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this weight entry?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteEntryId(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteEntry}
            color="error"
            variant="contained"
            disabled={deleteEntry.isPending}
          >
            {deleteEntry.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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
