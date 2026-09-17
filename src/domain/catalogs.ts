import type { Employee, ExamType, FactorCategory } from './types'

export const factorCategories: FactorCategory[] = ['PHYSICAL', 'DUST', 'CHEMICAL', 'BIOLOGICAL', 'OTHER']

export const examTypes: ExamType[] = ['INITIAL', 'PERIODIC', 'CONTROL']

export const documentTypes = ['passport', 'id_card', 'residence_card', 'other'] as const satisfies ReadonlyArray<NonNullable<Employee['documentType']>>

export const INITIAL_PASSWORD = 'Haslo123!'
