import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import uk from './uk.json'

export const SUPPORTED_LOCALES = ['en', 'uk'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, uk: { translation: uk } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
