import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from '@mui/material'
import type { ExerciseName } from '../../types/exercise'
import { EXERCISE_NAMES } from '../../types/exercise'

export interface ExerciseFormData {
  name: ExerciseName | ''
  weight: string
  reps: string
  sets: string
  notes: string
  date: string
}

export const emptyForm: ExerciseFormData = {
  name: '',
  weight: '',
  reps: '',
  sets: '',
  notes: '',
  date: new Date().toISOString().split('T')[0],
}

interface ExerciseFormDialogProps {
  open: boolean
  isSaving: boolean
  formData: ExerciseFormData
  lockedName?: ExerciseName
  onFormChange: (field: keyof ExerciseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectChange: (e: SelectChangeEvent) => void
  onSubmit: () => void
  onClose: () => void
}

export default function ExerciseFormDialog({
  open,
  isSaving,
  formData,
  lockedName,
  onFormChange,
  onSelectChange,
  onSubmit,
  onClose,
}: ExerciseFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Log Weight</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth required>
            <InputLabel id="exercise-name-label">Exercise Name</InputLabel>
            <Select
              labelId="exercise-name-label"
              value={formData.name}
              label="Exercise Name"
              onChange={onSelectChange}
              disabled={!!lockedName}
            >
              {EXERCISE_NAMES.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Weight (kg)"
            type="number"
            value={formData.weight}
            onChange={onFormChange('weight')}
            required
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 300 } }}
            helperText="1 – 300 kg"
          />
          <TextField
            label="Reps"
            type="number"
            value={formData.reps}
            onChange={onFormChange('reps')}
            fullWidth
          />
          <TextField
            label="Sets"
            type="number"
            value={formData.sets}
            onChange={onFormChange('sets')}
            fullWidth
          />
          <TextField
            label="Notes"
            value={formData.notes}
            onChange={onFormChange('notes')}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={onFormChange('date')}
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
            !formData.name ||
            !formData.weight ||
            Number(formData.weight) < 1 ||
            Number(formData.weight) > 300 ||
            isSaving
          }
        >
          {isSaving ? 'Saving...' : 'Log'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
