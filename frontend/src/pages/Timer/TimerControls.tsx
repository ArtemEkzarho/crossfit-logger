import { PauseCircle, PlayCircle, RestartAlt } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { pauseAtom, resetAtom, startAtom, statusAtom } from './timerAtoms'

export default function TimerControls() {
  const status = useAtomValue(statusAtom)
  const start = useSetAtom(startAtom)
  const pause = useSetAtom(pauseAtom)
  const reset = useSetAtom(resetAtom)

  return (
    <Box display="flex" gap={2} justifyContent="center">
      <Button
        variant="outlined"
        size="large"
        startIcon={<RestartAlt />}
        onClick={reset}
        disabled={status === 'idle'}
      >
        Reset
      </Button>

      {status === 'running' ? (
        <Button variant="contained" size="large" startIcon={<PauseCircle />} onClick={pause}>
          Pause
        </Button>
      ) : status === 'countdown' ? (
        <Button
          variant="contained"
          size="large"
          color="warning"
          startIcon={<RestartAlt />}
          onClick={reset}
        >
          Cancel
        </Button>
      ) : (
        <Button
          variant="contained"
          size="large"
          color={status === 'done' ? 'error' : 'primary'}
          startIcon={<PlayCircle />}
          onClick={status === 'done' ? reset : start}
        >
          {status === 'paused' ? 'Resume' : status === 'done' ? 'New' : 'Start'}
        </Button>
      )}
    </Box>
  )
}
