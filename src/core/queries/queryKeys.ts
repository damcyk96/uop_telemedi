import type { Locale } from '@/i18n/types'

export const queryKeys = {
  company: ['company'],
  employees: ['employees'],
  exposureFactors: ['exposureFactors'],
  referralTemplates: ['referralTemplates'],
  referrals: ['referrals'],
  users: ['users'],
  translations(locale: Locale) {
    return ['translations', locale] as const
  },
} as const
