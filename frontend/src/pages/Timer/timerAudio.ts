function beep(freq: number, dur: number) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  } catch {
    // AudioContext unavailable — ignore
  }
}

export const playCountdown = () => beep(440, 0.12)

export const playTransition = () => {
  beep(660, 0.15)
  setTimeout(() => beep(660, 0.15), 220)
}

export const playDone = () => {
  beep(880, 0.4)
  setTimeout(() => beep(880, 0.4), 550)
  setTimeout(() => beep(880, 0.4), 1100)
}
