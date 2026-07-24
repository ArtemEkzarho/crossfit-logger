import {
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
  Stack,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ExerciseName } from '../../types/exercise'
import { EXERCISE_NAMES, getExerciseMetric } from '../../types/exercise'

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
  const { t } = useTranslation()
  const metric = formData.name ? getExerciseMetric(formData.name) : 'weight'
  const isReps = metric === 'reps'

  const isSubmitDisabled = isReps
    ? !formData.name ||
      !formData.reps ||
      Number(formData.reps) < 1 ||
      Number(formData.reps) > 500 ||
      isSaving
    : !formData.name ||
      !formData.weight ||
      Number(formData.weight) < 1 ||
      Number(formData.weight) > 300 ||
      isSaving

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('exercises.form.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <FormControl fullWidth required>
            <InputLabel id="exercise-name-label">{t('exercises.form.name')}</InputLabel>
            <Select
              labelId="exercise-name-label"
              value={formData.name}
              label={t('exercises.form.name')}
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
          {!isReps && (
            <TextField
              label={t('exercises.form.weight')}
              type="number"
              value={formData.weight}
              onChange={onFormChange('weight')}
              required
              fullWidth
              slotProps={{ htmlInput: { min: 1, max: 300 } }}
              helperText={t('exercises.form.weightHelper')}
            />
          )}
          <TextField
            label={t('exercises.form.reps')}
            type="number"
            value={formData.reps}
            onChange={onFormChange('reps')}
            required={isReps}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 500 } }}
            helperText={t('exercises.form.repsHelper')}
          />
          <TextField
            label={t('exercises.form.sets')}
            type="number"
            value={formData.sets}
            onChange={onFormChange('sets')}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 10 } }}
            helperText={t('exercises.form.setsHelper')}
          />
          <TextField
            label={t('exercises.form.notes')}
            value={formData.notes}
            onChange={onFormChange('notes')}
            multiline
            rows={3}
            fullWidth
            slotProps={{ htmlInput: { maxLength: 300 } }}
            helperText={`${formData.notes.length} / 300`}
          />
          <TextField
            label={t('exercises.form.date')}
            type="date"
            value={formData.date}
            onChange={onFormChange('date')}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onSubmit} variant="contained" disabled={isSubmitDisabled}>
          {isSaving ? t('common.saving') : t('exercises.form.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
