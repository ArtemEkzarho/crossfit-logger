import { useParams } from 'react-router-dom'

export function useLocalePath() {
  const { locale } = useParams<{ locale: string }>()
  return (path: string) => `/${locale}${path}`
}
