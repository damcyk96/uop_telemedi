import { createContext, useEffect, useMemo, type ReactNode } from 'react'
import { useGetTranslations } from '@/core/queries'
import { createTranslator } from '@/i18n/translate'
import type { Locale, Translate, Translations } from '@/i18n/types'

export interface I18nContextValue {
  locale: Locale
  translations: Translations
  t: Translate
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export interface I18nProviderProps {
  locale: Locale
  children: ReactNode
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  const translationsQuery = useGetTranslations(locale)
  const translations = translationsQuery.data

  const value = useMemo(() => {
    if (!translations) {
      return null
    }
    return { locale, translations, t: createTranslator(translations, locale) }
  }, [locale, translations])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  if (!value) {
    return (
      <div className="loading" aria-busy="true">
        <span />
        <span />
        <span />
      </div>
    )
  }

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}
