import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { SUPPORTED_LOCALES, type SupportedLocale } from '../locales/i18n'

function isSupported(locale: string | undefined): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

export default function LocaleWrapper() {
  const { locale } = useParams<{ locale: string }>()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (isSupported(locale) && i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  if (!isSupported(locale)) {
    return <Navigate to="/en" replace />
  }

  return <Outlet />
}
