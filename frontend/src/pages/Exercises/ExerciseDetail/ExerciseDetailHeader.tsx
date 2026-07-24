import { ArrowBack, Percent } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExerciseMetric } from '../../../types/exercise'

const PERCENTAGES = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95]

interface ExerciseDetailHeaderProps {
  name: string
  maxValue: number | undefined
  metric: ExerciseMetric
  onBack: () => void
  onLogWeight: () => void
}

export default function ExerciseDetailHeader({
  name,
  maxValue,
  metric,
  onBack,
  onLogWeight,
}: ExerciseDetailHeaderProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const unit =
    metric === 'reps' ? t('exerciseDetail.weightHistory.header.reps') : t('dashboard.unit.kg')

  return (
    <>
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
        {t('exerciseDetail.header.back')}
      </Button>

      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 4 }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            {name}
          </Typography>
          {maxValue != null && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', mt: 1 }}>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                {maxValue}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                {unit}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {t('exerciseDetail.header.personalBest')}
              </Typography>
            </Stack>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip
            title={
              maxValue == null
                ? t('exerciseDetail.header.noPR')
                : t('exerciseDetail.header.percentOfPR')
            }
          >
            <span>
              <IconButton
                onClick={() => setOpen(true)}
                disabled={maxValue == null}
                color="primary"
                sx={{ border: 1, borderColor: 'divider' }}
              >
                <Percent />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="contained" onClick={onLogWeight}>
            {t('exerciseDetail.header.logEntry')}
          </Button>
        </Stack>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
        <DialogTitle>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {t('exerciseDetail.header.prDialogTitle', { value: maxValue, unit })}
            <IconButton onClick={() => setOpen(false)}>
              <ArrowBack />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <List disablePadding>
            {PERCENTAGES.map((pct) => {
              const value = parseFloat((((maxValue ?? 0) * pct) / 100).toFixed(2))
              return (
                <ListItem key={pct} divider sx={{ py: 2 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="h6" color="text.secondary">
                      {pct}%
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {value} {unit}
                    </Typography>
                  </Stack>
                </ListItem>
              )
            })}
          </List>
        </DialogContent>
      </Dialog>
    </>
  )
}
