import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  maxValue: number | undefined
  onChange: (field: keyof Omit<EditEntryState, 'entryId'>, value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function EditEntryDialog({
  open,
  editEntry,
  isSaving,
  metric,
  maxValue,
  onChange,
  onSubmit,
  onClose,
}: EditEntryDialogProps) {
  const { t } = useTranslation()
  const isReps = metric === 'reps'
  const [percentDraft, setPercentDraft] = useState('')

  useEffect(() => {
    setPercentDraft(
      editEntry?.weight && maxValue
        ? ((Number(editEntry.weight) / maxValue) * 100).toFixed(1)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editEntry?.entryId, open])

  const isSubmitDisabled = isReps
    ? !editEntry?.reps || Number(editEntry.reps) < 1 || Number(editEntry.reps) > 500 || isSaving
    : !editEntry?.weight ||
      Number(editEntry.weight) < 1 ||
      Number(editEntry.weight) > 300 ||
      isSaving

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('exerciseDetail.editDialog.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {!isReps && (
            <Stack direction="row" spacing={2}>
              <TextField
                label={t('exercises.form.weight')}
                type="number"
                value={editEntry?.weight ?? ''}
                onChange={(e) => {
                  const weight = e.target.value
                  onChange('weight', weight)
                  setPercentDraft(
                    weight && maxValue ? ((Number(weight) / maxValue) * 100).toFixed(1) : ''
                  )
                }}
                required
                fullWidth
                slotProps={{ htmlInput: { min: 1, max: 300 } }}
                helperText={t('exercises.form.weightHelper')}
              />
              <TextField
                label={t('exercises.form.weightPercent')}
                type="number"
                value={percentDraft}
                onChange={(e) => {
                  const pct = e.target.value
                  setPercentDraft(pct)
                  if (!maxValue) return
                  onChange('weight', pct === '' ? '' : ((Number(pct) * maxValue) / 100).toFixed(1))
                }}
                fullWidth
                disabled={!maxValue}
                helperText={t('exercises.form.weightPercentHelper')}
              />
            </Stack>
          )}
          <TextField
            label={t('exercises.form.reps')}
            type="number"
            value={editEntry?.reps ?? ''}
            onChange={(e) => onChange('reps', e.target.value)}
            required={isReps}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 500 } }}
            helperText={t('exercises.form.repsHelper')}
          />
          <TextField
            label={t('exercises.form.sets')}
            type="number"
            value={editEntry?.sets ?? ''}
            onChange={(e) => onChange('sets', e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 10 } }}
            helperText={t('exercises.form.setsHelper')}
          />
          <TextField
            label={t('exercises.form.notes')}
            value={editEntry?.notes ?? ''}
            onChange={(e) => onChange('notes', e.target.value)}
            multiline
            rows={3}
            fullWidth
            slotProps={{ htmlInput: { maxLength: 300 } }}
            helperText={`${(editEntry?.notes ?? '').length} / 300`}
          />
          <TextField
            label={t('exercises.form.date')}
            type="date"
            value={editEntry?.date ?? ''}
            onChange={(e) => onChange('date', e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onSubmit} variant="contained" disabled={isSubmitDisabled}>
          {isSaving ? t('common.saving') : t('exerciseDetail.editDialog.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
