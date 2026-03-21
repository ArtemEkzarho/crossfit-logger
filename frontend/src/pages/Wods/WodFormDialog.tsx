import { Add, Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { WodMovement, WodType } from '../../types/wod'
import { WOD_TYPES } from '../../types/wod'

export interface WodFormData {
  date: string
  type: WodType
  name: string
  movements: WodMovement[]
  notes: string
}

export const emptyWodForm = (): WodFormData => ({
  date: new Date().toISOString().split('T')[0],
  type: 'forTime',
  name: '',
  movements: [{ name: '', reps: undefined, weight: undefined }],
  notes: '',
})

interface WodFormDialogProps {
  open: boolean
  isSaving: boolean
  formData: WodFormData
  onChange: (data: WodFormData) => void
  onSubmit: () => void
  onClose: () => void
}

export default function WodFormDialog({
  open,
  isSaving,
  formData,
  onChange,
  onSubmit,
  onClose,
}: WodFormDialogProps) {
  const { t } = useTranslation()

  const set = (patch: Partial<WodFormData>) => onChange({ ...formData, ...patch })

  const updateMovement = (i: number, patch: Partial<WodMovement>) => {
    const movements = formData.movements.map((m, idx) => (idx === i ? { ...m, ...patch } : m))
    set({ movements })
  }

  const addMovement = () =>
    set({ movements: [...formData.movements, { name: '', reps: undefined, weight: undefined }] })

  const removeMovement = (i: number) =>
    set({ movements: formData.movements.filter((_, idx) => idx !== i) })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('wods.form.title')}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>

          <Box display="flex" gap={2}>
            <TextField
              label={t('wods.form.date')}
              type="date"
              value={formData.date}
              onChange={(e) => set({ date: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ flex: 1 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>{t('wods.form.type')}</InputLabel>
              <Select
                value={formData.type}
                label={t('wods.form.type')}
                onChange={(e) => set({ type: e.target.value as WodType })}
              >
                {WOD_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`wods.types.${type}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label={t('wods.form.wodName')}
            fullWidth
            value={formData.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Fran, Helen, Grace..."
          />

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('wods.form.movements')}
            </Typography>
            <Stack spacing={1}>
              {formData.movements.map((m, i) => (
                <Box key={i} display="flex" gap={1} alignItems="center">
                  <TextField
                    label={t('wods.form.movement.name')}
                    size="small"
                    value={m.name}
                    onChange={(e) => updateMovement(i, { name: e.target.value })}
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label={t('wods.form.movement.reps')}
                    type="number"
                    size="small"
                    value={m.reps ?? ''}
                    onChange={(e) =>
                      updateMovement(i, { reps: e.target.value ? Number(e.target.value) : undefined })
                    }
                    slotProps={{ htmlInput: { min: 1 } }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label={t('wods.form.movement.weight')}
                    type="number"
                    size="small"
                    value={m.weight ?? ''}
                    onChange={(e) =>
                      updateMovement(i, { weight: e.target.value ? Number(e.target.value) : undefined })
                    }
                    slotProps={{ htmlInput: { min: 0 } }}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeMovement(i)}
                    disabled={formData.movements.length === 1}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
            <Button size="small" startIcon={<Add />} onClick={addMovement} sx={{ mt: 1 }}>
              {t('wods.form.addMovement')}
            </Button>
          </Box>

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
          {isSaving ? t('common.saving') : t('wods.form.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
