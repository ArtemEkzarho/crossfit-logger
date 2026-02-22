import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

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
  onChange: (field: keyof Omit<EditEntryState, 'entryId'>, value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function EditEntryDialog({
  open,
  editEntry,
  isSaving,
  onChange,
  onSubmit,
  onClose,
}: EditEntryDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
          <TextField
            label="Reps"
            type="number"
            value={editEntry?.reps ?? ''}
            onChange={(e) => onChange('reps', e.target.value)}
            fullWidth
          />
          <TextField
            label="Sets"
            type="number"
            value={editEntry?.sets ?? ''}
            onChange={(e) => onChange('sets', e.target.value)}
            fullWidth
          />
          <TextField
            label="Notes"
            value={editEntry?.notes ?? ''}
            onChange={(e) => onChange('notes', e.target.value)}
            multiline
            rows={3}
            fullWidth
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
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={
            !editEntry?.weight ||
            Number(editEntry.weight) < 1 ||
            Number(editEntry.weight) > 300 ||
            isSaving
          }
        >
          {isSaving ? 'Saving...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
