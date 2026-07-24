import { PauseCircle, PlayCircle, RestartAlt } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { pauseAtom, resetAtom, startAtom, statusAtom } from './timerAtoms'

export default function TimerControls() {
  const status = useAtomValue(statusAtom)
  const start = useSetAtom(startAtom)
  const pause = useSetAtom(pauseAtom)
  const reset = useSetAtom(resetAtom)
  const { t } = useTranslation()

  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
      <Button
        variant="outlined"
        size="large"
        startIcon={<RestartAlt />}
        onClick={reset}
        disabled={status === 'idle'}
      >
        {t('timer.controls.reset')}
      </Button>

      {status === 'running' ? (
        <Button variant="contained" size="large" startIcon={<PauseCircle />} onClick={pause}>
          {t('timer.controls.pause')}
        </Button>
      ) : status === 'countdown' ? (
        <Button
          variant="contained"
          size="large"
          color="warning"
          startIcon={<RestartAlt />}
          onClick={reset}
        >
          {t('timer.controls.cancel')}
        </Button>
      ) : (
        <Button
          variant="contained"
          size="large"
          color={status === 'done' ? 'error' : 'primary'}
          startIcon={<PlayCircle />}
          onClick={status === 'done' ? reset : start}
        >
          {status === 'paused'
            ? t('timer.controls.resume')
            : status === 'done'
            ? t('timer.controls.new')
            : t('timer.controls.start')}
        </Button>
      )}
    </Stack>
  )
}
