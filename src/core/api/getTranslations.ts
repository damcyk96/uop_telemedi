import type { Locale, Translations } from '@/i18n/types'
import { simulateApiResponse } from './simulateApiResponse'

const localePayloads: Record<Locale, () => Promise<Translations>> = {
  pl: async () => {
    const { pl } = await import('@/i18n/locales/pl')
    return pl
  },
}

export function getTranslations(locale: Locale) {
  return simulateApiResponse(localePayloads[locale])
}
