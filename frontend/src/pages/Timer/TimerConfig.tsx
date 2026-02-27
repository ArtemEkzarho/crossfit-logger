import { Box, Paper, TextField, Typography } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
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

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {mode === 'ForTime' ? (
        <Typography variant="body2" color="text.secondary">
          Press Start and stop when you finish.
        </Typography>
      ) : mode === 'Tabata' ? (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <ConfigField
            label="Work (sec)"
            value={tabataWork}
            onChange={setTabataWork}
            min={5}
            max={300}
            helperText="5 – 300 s"
          />
          <ConfigField
            label="Rest (sec)"
            value={tabataRest}
            onChange={setTabataRest}
            min={1}
            max={300}
            helperText="1 – 300 s"
          />
          <ConfigField
            label="Rounds"
            value={tabataRounds}
            onChange={setTabataRounds}
            min={1}
            max={50}
            helperText="1 – 50"
          />
        </Box>
      ) : (
        <ConfigField
          label="Duration (min)"
          value={durationMin}
          onChange={setDurationMin}
          min={1}
          max={120}
          helperText="1 – 120 min"
        />
      )}
    </Paper>
  )
}
