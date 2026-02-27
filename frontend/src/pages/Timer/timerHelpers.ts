export function fmt(sec: number): string {
  const m = Math.floor(Math.abs(sec) / 60)
  const s = Math.abs(sec) % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
