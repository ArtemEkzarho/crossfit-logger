import { Box, Chip, Paper, Typography } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import {
  currentRoundAtom,
  displaySecAtom,
  durationMinAtom,
  modeAtom,
  phaseAtom,
  preCountdownAtom,
  statusAtom,
  tabataRoundsAtom,
  timerColorAtom,
} from './timerAtoms'
import { fmt } from './timerHelpers'

function SubLabel() {
  const mode = useAtomValue(modeAtom)
  const status = useAtomValue(statusAtom)
  const currentRound = useAtomValue(currentRoundAtom)
  const durationMin = useAtomValue(durationMinAtom)
  const tabataRounds = useAtomValue(tabataRoundsAtom)
  const phase = useAtomValue(phaseAtom)
  const { t } = useTranslation()

  if (mode === 'EMOM') {
    return (
      <Typography variant="h6" color="text.secondary">
        {t('timer.display.minute', { current: currentRound, total: durationMin })}
      </Typography>
    )
  }

  if (mode === 'Tabata' && status !== 'idle') {
    return (
      <Box display="flex" gap={1.5} alignItems="center">
        <Chip
          label={phase === 'work' ? t('timer.display.work') : t('timer.display.rest')}
          color={phase === 'work' ? 'success' : 'warning'}
          size="medium"
        />
        <Typography variant="h6" color="text.secondary">
          {t('timer.display.round', { current: currentRound, total: tabataRounds })}
        </Typography>
      </Box>
    )
  }

  return null
}

export default function TimerDisplay() {
  const status = useAtomValue(statusAtom)
  const preCountdown = useAtomValue(preCountdownAtom)
  const displaySec = useAtomValue(displaySecAtom)
  const color = useAtomValue(timerColorAtom)
  const { t } = useTranslation()

  return (
    <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
      {status === 'countdown' ? (
        <>
          <Typography
            component="div"
            sx={{
              fontSize: { xs: '8rem', sm: '12rem' },
              fontWeight: 700,
              color: 'warning.main',
              lineHeight: 1,
              transition: 'color 0.2s',
            }}
          >
            {preCountdown}
          </Typography>
          <Typography variant="h6" color="text.secondary" mt={2}>
            {t('timer.display.getReady')}
          </Typography>
        </>
      ) : (
        <>
          <Typography
            component="div"
            sx={{
              fontSize: { xs: '5rem', sm: '8rem' },
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 4,
              color,
              lineHeight: 1,
              transition: 'color 0.3s',
            }}
          >
            {fmt(displaySec)}
          </Typography>
          <Box
            mt={2}
            minHeight={40}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {status === 'done' ? (
              <Chip label={t('timer.display.done')} color="error" size="medium" />
            ) : (
              <SubLabel />
            )}
          </Box>
        </>
      )}
    </Paper>
  )
}
