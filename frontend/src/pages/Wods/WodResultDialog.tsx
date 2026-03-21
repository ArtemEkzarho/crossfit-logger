import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { WodType } from '../../types/wod'

export interface ResultFormData {
  resultMinutes: string
  resultSeconds: string
  resultRounds: string
  resultReps: string
  resultTotalReps: string
  notes: string
  rxd: boolean
}

export const emptyResultForm = (): ResultFormData => ({
  resultMinutes: '',
  resultSeconds: '',
  resultRounds: '',
  resultReps: '',
  resultTotalReps: '',
  notes: '',
  rxd: false,
})

interface WodResultDialogProps {
  open: boolean
  isSaving: boolean
  wodType: WodType
  formData: ResultFormData
  onChange: (data: ResultFormData) => void
  onSubmit: () => void
  onClose: () => void
}

export default function WodResultDialog({
  open,
  isSaving,
  wodType,
  formData,
  onChange,
  onSubmit,
  onClose,
}: WodResultDialogProps) {
  const { t } = useTranslation()
  const set = (patch: Partial<ResultFormData>) => onChange({ ...formData, ...patch })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('wods.results.dialog.title')}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>

          {wodType === 'forTime' && (
            <Box display="flex" gap={2}>
              <TextField
                label={t('wods.form.timeMinutes')}
                type="number"
                value={formData.resultMinutes}
                onChange={(e) => set({ resultMinutes: e.target.value })}
                slotProps={{ htmlInput: { min: 0, max: 999 } }}
                sx={{ flex: 1 }}
              />
              <TextField
                label={t('wods.form.timeSeconds')}
                type="number"
                value={formData.resultSeconds}
                onChange={(e) => set({ resultSeconds: e.target.value })}
                slotProps={{ htmlInput: { min: 0, max: 59 } }}
                sx={{ flex: 1 }}
              />
            </Box>
          )}

          {(wodType === 'amrap' || wodType === 'emom') && (
            <Box display="flex" gap={2}>
              <TextField
                label={t('wods.form.rounds')}
                type="number"
                value={formData.resultRounds}
                onChange={(e) => set({ resultRounds: e.target.value })}
                slotProps={{ htmlInput: { min: 0 } }}
                sx={{ flex: 1 }}
              />
              {wodType === 'amrap' && (
                <TextField
                  label={t('wods.form.reps')}
                  type="number"
                  value={formData.resultReps}
                  onChange={(e) => set({ resultReps: e.target.value })}
                  slotProps={{ htmlInput: { min: 0 } }}
                  sx={{ flex: 1 }}
                />
              )}
            </Box>
          )}

          {wodType === 'tabata' && (
            <TextField
              label={t('wods.form.totalReps')}
              type="number"
              value={formData.resultTotalReps}
              onChange={(e) => set({ resultTotalReps: e.target.value })}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />
          )}

          <FormControlLabel
            control={
              <Checkbox checked={formData.rxd} onChange={(e) => set({ rxd: e.target.checked })} />
            }
            label={t('wods.form.rxd')}
          />

          <TextField
            label={t('wods.form.notes')}
            multiline
            rows={3}
            fullWidth
            value={formData.notes}
            onChange={(e) => set({ notes: e.target.value })}
          />

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onSubmit} variant="contained" disabled={isSaving}>
          {isSaving ? t('common.saving') : t('wods.results.dialog.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
