import { Box, Stack, TextField, Typography } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import {
  durationMinAtom,
  isActiveAtom,
  modeAtom,
  tabataRestAtom,
  tabataRoundsAtom,
  tabataWorkAtom,
} from './timerAtoms'

function ConfigField({
  label,
  value,
  onChange,
  min,
  max,
  helperText,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  helperText: string
}) {
  const disabled = useAtomValue(isActiveAtom)
  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={(e) => {
        const v = Number(e.target.value)
        if (v >= min && v <= max) onChange(v)
      }}
      disabled={disabled}
      size="small"
      slotProps={{ htmlInput: { min, max } }}
      helperText={helperText}
      sx={{ width: 150 }}
    />
  )
}

export default function TimerConfig() {
  const mode = useAtomValue(modeAtom)
  const [durationMin, setDurationMin] = useAtom(durationMinAtom)
  const [tabataWork, setTabataWork] = useAtom(tabataWorkAtom)
  const [tabataRest, setTabataRest] = useAtom(tabataRestAtom)
  const [tabataRounds, setTabataRounds] = useAtom(tabataRoundsAtom)
  const { t } = useTranslation()

  return (
    <Box sx={{ mb: 2 }}>
      {mode === 'ForTime' ? (
        <Typography variant="body2" color="text.secondary">
          {t('timer.config.forTimeHint')}
        </Typography>
      ) : mode === 'Tabata' ? (
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <ConfigField
            label={t('timer.config.work')}
            value={tabataWork}
            onChange={setTabataWork}
            min={5}
            max={300}
            helperText={t('timer.config.workHelper')}
          />
          <ConfigField
            label={t('timer.config.rest')}
            value={tabataRest}
            onChange={setTabataRest}
            min={1}
            max={300}
            helperText={t('timer.config.restHelper')}
          />
          <ConfigField
            label={t('timer.config.rounds')}
            value={tabataRounds}
            onChange={setTabataRounds}
            min={1}
            max={50}
            helperText={t('timer.config.roundsHelper')}
          />
        </Stack>
      ) : (
        <ConfigField
          label={t('timer.config.duration')}
          value={durationMin}
          onChange={setDurationMin}
          min={1}
          max={120}
          helperText={t('timer.config.durationHelper')}
        />
      )}
    </Box>
  )
}
