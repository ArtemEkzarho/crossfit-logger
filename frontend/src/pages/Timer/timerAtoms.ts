import { atom } from 'jotai'

export type Mode = 'AMRAP' | 'EMOM' | 'ForTime' | 'Tabata'
export type Status = 'idle' | 'countdown' | 'running' | 'paused' | 'done'
export type AudioEvent = 'countdown' | 'transition' | 'done'

export const PRE_COUNTDOWN = 5

// ── Config atoms (persist across resets) ──────────────────────────────────────

export const modeAtom = atom<Mode>('AMRAP')
export const durationMinAtom = atom(20)
export const tabataWorkAtom = atom(20)
export const tabataRestAtom = atom(10)
export const tabataRoundsAtom = atom(8)

// ── Runtime atoms (cleared on reset) ─────────────────────────────────────────

export const statusAtom = atom<Status>('idle')
export const elapsedAtom = atom(0)
export const currentRoundAtom = atom(1)
export const phaseAtom = atom<'work' | 'rest'>('work')
export const phaseElapsedAtom = atom(0)
export const preCountdownAtom = atom(PRE_COUNTDOWN)

// New object per emission → useEffect always re-fires even for repeated events
export const audioSignalAtom = atom<{ event: AudioEvent; id: number } | null>(null)

// ── Derived atoms ─────────────────────────────────────────────────────────────

export const isActiveAtom = atom((get) => {
  const s = get(statusAtom)
  return s === 'running' || s === 'paused' || s === 'countdown'
})

export const displaySecAtom = atom((get) => {
  const status = get(statusAtom)
  const mode = get(modeAtom)
  const elapsed = get(elapsedAtom)
  const durationMin = get(durationMinAtom)
  const phase = get(phaseAtom)
  const phaseElapsed = get(phaseElapsedAtom)
  const tabataWork = get(tabataWorkAtom)
  const tabataRest = get(tabataRestAtom)

  if (status === 'done' && mode !== 'ForTime') return 0
  if (mode === 'AMRAP') return durationMin * 60 - elapsed
  if (mode === 'EMOM') return 60 - (elapsed % 60)
  if (mode === 'ForTime') return elapsed
  return (phase === 'work' ? tabataWork : tabataRest) - phaseElapsed
})

const countdownRemainingAtom = atom((get) => {
  const mode = get(modeAtom)
  const elapsed = get(elapsedAtom)
  const durationMin = get(durationMinAtom)
  const phase = get(phaseAtom)
  const phaseElapsed = get(phaseElapsedAtom)
  const tabataWork = get(tabataWorkAtom)
  const tabataRest = get(tabataRestAtom)

  if (mode === 'AMRAP') return durationMin * 60 - elapsed
  if (mode === 'EMOM') return 60 - (elapsed % 60)
  if (mode === 'ForTime') return null
  return (phase === 'work' ? tabataWork : tabataRest) - phaseElapsed
})

export const timerColorAtom = atom((get) => {
  const status = get(statusAtom)
  if (status === 'done') return 'error.main'
  if (status !== 'running') return 'text.secondary'
  const r = get(countdownRemainingAtom)
  if (r !== null && r <= 3) return 'warning.main'
  return 'success.main'
})

// ── Action atoms ──────────────────────────────────────────────────────────────

export const startAtom = atom(null, (_get, set) => {
  set(statusAtom, 'countdown')
  set(preCountdownAtom, PRE_COUNTDOWN)
})

export const pauseAtom = atom(null, (_get, set) => {
  set(statusAtom, 'paused')
})

export const resetAtom = atom(null, (_get, set) => {
  set(statusAtom, 'idle')
  set(elapsedAtom, 0)
  set(currentRoundAtom, 1)
  set(phaseAtom, 'work')
  set(phaseElapsedAtom, 0)
  set(preCountdownAtom, PRE_COUNTDOWN)
  set(audioSignalAtom, null)
})

export const setModeAtom = atom(null, (_get, set, mode: Mode) => {
  set(modeAtom, mode)
  set(statusAtom, 'idle')
  set(elapsedAtom, 0)
  set(currentRoundAtom, 1)
  set(phaseAtom, 'work')
  set(phaseElapsedAtom, 0)
  set(preCountdownAtom, PRE_COUNTDOWN)
  set(audioSignalAtom, null)
})

const signal = (event: AudioEvent) => ({ event, id: Date.now() })

export const tickAtom = atom(null, (get, set) => {
  const status = get(statusAtom)

  // ── Pre-start countdown ────────────────────────────────────────────────────
  if (status === 'countdown') {
    const next = get(preCountdownAtom) - 1
    if (next <= 0) {
      set(statusAtom, 'running')
      set(preCountdownAtom, PRE_COUNTDOWN)
      set(audioSignalAtom, signal('transition')) // GO!
    } else {
      set(preCountdownAtom, next)
      set(audioSignalAtom, signal('countdown'))
    }
    return
  }

  if (status !== 'running') return

  const mode = get(modeAtom)
  const elapsed = get(elapsedAtom)
  const durationMin = get(durationMinAtom)
  const currentRound = get(currentRoundAtom)
  const phase = get(phaseAtom)
  const phaseElapsed = get(phaseElapsedAtom)
  const tabataWork = get(tabataWorkAtom)
  const tabataRest = get(tabataRestAtom)
  const tabataRounds = get(tabataRoundsAtom)
  const e = elapsed + 1

  // ── AMRAP ──────────────────────────────────────────────────────────────────
  if (mode === 'AMRAP') {
    const total = durationMin * 60
    if (e >= total) {
      set(elapsedAtom, total)
      set(statusAtom, 'done')
      set(audioSignalAtom, signal('done'))
    } else {
      set(elapsedAtom, e)
      const r = total - e
      if (r <= 3 && r > 0) set(audioSignalAtom, signal('countdown'))
    }
    return
  }

  // ── EMOM ───────────────────────────────────────────────────────────────────
  if (mode === 'EMOM') {
    const total = durationMin * 60
    const newRound = Math.min(Math.floor(e / 60) + 1, durationMin)
    if (e >= total) {
      set(elapsedAtom, total)
      set(statusAtom, 'done')
      set(currentRoundAtom, durationMin)
      set(audioSignalAtom, signal('done'))
    } else {
      set(elapsedAtom, e)
      if (newRound !== currentRound) {
        set(currentRoundAtom, newRound)
        set(audioSignalAtom, signal('transition'))
      } else {
        const r = 60 - (e % 60)
        if (r <= 3 && r > 0) set(audioSignalAtom, signal('countdown'))
      }
    }
    return
  }

  // ── For Time ───────────────────────────────────────────────────────────────
  if (mode === 'ForTime') {
    set(elapsedAtom, e)
    return
  }

  // ── Tabata ─────────────────────────────────────────────────────────────────
  const pe = phaseElapsed + 1
  const dur = phase === 'work' ? tabataWork : tabataRest

  if (pe >= dur) {
    set(elapsedAtom, e)
    if (phase === 'work') {
      set(phaseAtom, 'rest')
      set(phaseElapsedAtom, 0)
      set(audioSignalAtom, signal('transition'))
    } else if (currentRound >= tabataRounds) {
      set(statusAtom, 'done')
      set(audioSignalAtom, signal('done'))
    } else {
      set(phaseAtom, 'work')
      set(phaseElapsedAtom, 0)
      set(currentRoundAtom, currentRound + 1)
      set(audioSignalAtom, signal('transition'))
    }
  } else {
    set(elapsedAtom, e)
    set(phaseElapsedAtom, pe)
    const r = dur - pe
    if (r <= 3 && r > 0) set(audioSignalAtom, signal('countdown'))
  }
})
