import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import type { ExerciseMetric } from '../../../types/exercise'

export interface EditEntryState {
  entryId: string
  weight: string
  reps: string
  sets: string
  notes: string
  date: string
}

interface EditEntryDialogProps {
  open: boolean
  editEntry: EditEntryState | null
  isSaving: boolean
  metric: ExerciseMetric
  onChange: (field: keyof Omit<EditEntryState, 'entryId'>, value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function EditEntryDialog({
  open,
  editEntry,
  isSaving,
  metric,
  onChange,
  onSubmit,
  onClose,
}: EditEntryDialogProps) {
  const isReps = metric === 'reps'

  const isSubmitDisabled = isReps
    ? !editEntry?.reps ||
      Number(editEntry.reps) < 1 ||
      Number(editEntry.reps) > 500 ||
      isSaving
    : !editEntry?.weight ||
      Number(editEntry.weight) < 1 ||
      Number(editEntry.weight) > 300 ||
      isSaving

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {!isReps && (
            <TextField
              label="Weight (kg)"
              type="number"
              value={editEntry?.weight ?? ''}
              onChange={(e) => onChange('weight', e.target.value)}
              required
              fullWidth
              slotProps={{ htmlInput: { min: 1, max: 300 } }}
              helperText="1 – 300 kg"
            />
          )}
          <TextField
            label="Reps"
            type="number"
            value={editEntry?.reps ?? ''}
            onChange={(e) => onChange('reps', e.target.value)}
            required={isReps}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 500 } }}
            helperText="1 – 500"
          />
          <TextField
            label="Sets"
            type="number"
            value={editEntry?.sets ?? ''}
            onChange={(e) => onChange('sets', e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 10 } }}
            helperText="1 – 10"
          />
          <TextField
            label="Notes"
            value={editEntry?.notes ?? ''}
            onChange={(e) => onChange('notes', e.target.value)}
            multiline
            rows={3}
            fullWidth
            slotProps={{ htmlInput: { maxLength: 300 } }}
            helperText={`${(editEntry?.notes ?? '').length} / 300`}
          />
          <TextField
            label="Date"
            type="date"
            value={editEntry?.date ?? ''}
            onChange={(e) => onChange('date', e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" disabled={isSubmitDisabled}>
          {isSaving ? 'Saving...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
