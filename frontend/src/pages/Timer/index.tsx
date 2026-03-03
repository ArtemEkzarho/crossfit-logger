import { Box, Container, Tab, Tabs, Typography } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { playCountdown, playDone, playTransition } from './timerAudio'
import {
  audioSignalAtom,
  isActiveAtom,
  modeAtom,
  setModeAtom,
  statusAtom,
  tickAtom,
  type Mode,
} from './timerAtoms'
import TimerConfig from './TimerConfig'
import TimerControls from './TimerControls'
import TimerDisplay from './TimerDisplay'

const MODES: Mode[] = ['AMRAP', 'EMOM', 'ForTime', 'Tabata']

export default function Timer() {
  const status = useAtomValue(statusAtom)
  const mode = useAtomValue(modeAtom)
  const isActive = useAtomValue(isActiveAtom)
  const audioSignal = useAtomValue(audioSignalAtom)
  const tick = useSetAtom(tickAtom)
  const setMode = useSetAtom(setModeAtom)
  const { t } = useTranslation()

  const MODE_LABELS: Record<Mode, string> = {
    AMRAP: t('timer.mode.amrap'),
    EMOM: t('timer.mode.emom'),
    ForTime: t('timer.mode.forTime'),
    Tabata: t('timer.mode.tabata'),
  }

  // Interval — runs during pre-start countdown and actual timer
  useEffect(() => {
    if (status !== 'running' && status !== 'countdown') return
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [status, tick])

  // Audio — audioSignal always gets a new object reference, so this fires on every emission
  useEffect(() => {
    if (!audioSignal) return
    if (audioSignal.event === 'countdown') playCountdown()
    else if (audioSignal.event === 'transition') playTransition()
    else if (audioSignal.event === 'done') playDone()
  }, [audioSignal])

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('timer.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {t('timer.subtitle')}
        </Typography>

        <Tabs
          value={MODES.indexOf(mode)}
          onChange={(_, i) => setMode(MODES[i])}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          {MODES.map((m) => (
            <Tab key={m} label={MODE_LABELS[m]} disabled={isActive} />
          ))}
        </Tabs>

        <TimerConfig />
        <TimerDisplay />
        <TimerControls />
      </Box>
    </Container>
  )
}
