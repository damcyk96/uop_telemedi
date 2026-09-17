import { z } from 'zod'
import { examTypes } from '@/domain/catalogs'
import type { Employee, ExamType, ExposureFactor, ID, Referral } from '@/domain/types'
import type { TranslationKey } from '@/i18n/types'

const messages = {
  employeeRequired: 'validation.referral.employeeRequired',
  positionRequired: 'validation.referral.positionRequired',
  deadlineInvalid: 'validation.referral.deadlineInvalid',
  cityRequired: 'validation.referral.cityRequired',
} as const satisfies Record<string, TranslationKey>

const inputSchema = z.object({
  employeeId: z.string().min(1, messages.employeeRequired),
  examType: z.enum(examTypes as [ExamType, ...ExamType[]]),
  position: z.string().trim().min(1, messages.positionRequired),
  factorIds: z.array(z.string()),
  workConditions: z.string().trim().optional(),
  resultDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, messages.deadlineInvalid),
  preferredCity: z.string().trim().min(1, messages.cityRequired),
  notes: z.string().trim().optional(),
})

export type IssueReferralInput = z.input<typeof inputSchema>

export class ReferralIssuanceError extends Error {
  constructor(
    readonly code: 'INVALID_INPUT' | 'DEADLINE_IN_PAST' | 'EMPLOYEE_NOT_FOUND' | 'FACTORS_NOT_FOUND' | 'SAVE_FAILED',
    readonly messageKey: TranslationKey,
    readonly fields?: Record<string, TranslationKey>,
  ) {
    super(messageKey)
    this.name = 'ReferralIssuanceError'
  }
}

export interface ReferralIssuancePersistence {
  load(input: { employeeId: ID; factorIds: readonly ID[] }): Promise<{ employee?: Employee; factors: ExposureFactor[]; existingNumbers: string[] }>
  append(referral: Referral): Promise<Referral>
}

export interface ReferralIssuanceDependencies {
  persistence: ReferralIssuancePersistence
  now?: () => Date
  nextId?: () => ID
}

function nextNumber(numbers: readonly string[], now: Date) {
  const highest = numbers.reduce((max, number) => {
    const suffix = Number(number.split('/').pop())
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max
  }, 0)
  return `SK/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(highest + 1).padStart(4, '0')}`
}

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

export function createReferralIssuance({ persistence, now = () => new Date(), nextId = () => crypto.randomUUID() }: ReferralIssuanceDependencies) {
  return {
    async issue(raw: IssueReferralInput): Promise<Referral> {
      const parsed = inputSchema.safeParse(raw)
      if (!parsed.success) {
        const fields = Object.fromEntries(parsed.error.issues.map(issue => [issue.path.join('.'), issue.message as TranslationKey]))
        throw new ReferralIssuanceError('INVALID_INPUT', 'validation.referral.incomplete', fields)
      }
      const issuedAt = now()
      if (parsed.data.resultDeadline < localDate(issuedAt)) {
        throw new ReferralIssuanceError('DEADLINE_IN_PAST', 'validation.referral.deadlineInPast', { resultDeadline: 'validation.referral.deadlineNotBeforeToday' })
      }
      const factorIds = [...new Set(parsed.data.factorIds)]
      const loaded = await persistence.load({ employeeId: parsed.data.employeeId, factorIds })
      if (!loaded.employee) {
        throw new ReferralIssuanceError('EMPLOYEE_NOT_FOUND', 'validation.referral.employeeNotFound')
      }
      const foundIds = new Set(loaded.factors.map(factor => factor.id))
      const missing = factorIds.filter(id => !foundIds.has(id))
      if (missing.length) {
        throw new ReferralIssuanceError('FACTORS_NOT_FOUND', 'validation.referral.factorsNotFound')
      }
      const factorOrder = new Map(factorIds.map((id, index) => [id, index]))
      const referral: Referral = {
        id: nextId(),
        number: nextNumber(loaded.existingNumbers, issuedAt),
        examType: parsed.data.examType as ExamType,
        employee: clone(loaded.employee),
        position: parsed.data.position,
        workConditions: parsed.data.workConditions || undefined,
        factors: clone(loaded.factors).sort((a, b) => (factorOrder.get(a.id) ?? 0) - (factorOrder.get(b.id) ?? 0)),
        resultDeadline: parsed.data.resultDeadline,
        preferredCity: parsed.data.preferredCity,
        notes: parsed.data.notes || undefined,
        status: 'ISSUED',
        createdAt: issuedAt.toISOString(),
      }
      try {
        return await persistence.append(referral)
      } catch {
        throw new ReferralIssuanceError('SAVE_FAILED', 'validation.referral.saveFailed')
      }
    },
  }
}

