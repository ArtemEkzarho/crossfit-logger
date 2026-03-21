import { useLocation, useNavigate, useParams } from 'react-router-dom'

export function useAppNavigation(afterNavigate?: () => void) {
  const navigate = useNavigate()
  const location = useLocation()
  const { locale } = useParams<{ locale: string }>()

  const localePath = (path: string) => `/${locale}${path}`

  const goTo = (path: string) => {
    navigate(path)
    afterNavigate?.()
  }

  const switchLocale = (newLang: string) => {
    const withoutLocale = location.pathname.replace(/^\/[a-z]{2}/, '')
    navigate(`/${newLang}${withoutLocale}`)
  }

  return { localePath, goTo, switchLocale }
}
