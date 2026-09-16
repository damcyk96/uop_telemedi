import type { ExamType, FactorCategory, ReferralStatus } from './types'
export const categories: {key: FactorCategory; label: string; short: string}[] = [
  { key: 'PHYSICAL', label: 'I. Czynniki fizyczne', short: 'Fizyczne' },
  { key: 'DUST', label: 'II. Pyły', short: 'Pyły' },
  { key: 'CHEMICAL', label: 'III. Czynniki chemiczne', short: 'Chemiczne' },
  { key: 'BIOLOGICAL', label: 'IV. Czynniki biologiczne', short: 'Biologiczne' },
  { key: 'OTHER', label: 'V. Inne, w tym niebezpieczne', short: 'Inne' },
]
export const examLabels: Record<ExamType,string> = { INITIAL: 'Wstępne', PERIODIC: 'Okresowe', CONTROL: 'Kontrolne' }
export const statusLabels: Record<ReferralStatus,string> = { ISSUED: 'Wystawione', IN_PROGRESS: 'W trakcie realizacji', SCHEDULED: 'Umówione', COMPLETED: 'Zrealizowane' }
