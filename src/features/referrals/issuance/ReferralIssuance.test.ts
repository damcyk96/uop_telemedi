import { describe, expect, it } from 'vitest'
import type { Employee, ExposureFactor } from '@/domain/types'
import { createReferralIssuance } from './ReferralIssuance'
import { InMemoryReferralIssuanceAdapter } from './InMemoryReferralIssuanceAdapter'

const employee: Employee = { id: 'employee-1', firstName: 'Ewa', lastName: 'Testowa', hasPesel: true, pesel: '99010112342', address: { street: 'Testowa 1', postalCode: '00-001', city: 'Warszawa' }, position: 'Księgowa' }
const factor: ExposureFactor = { id: 'factor-1', category: 'OTHER', name: 'Praca przy monitorze', source: 'SYSTEM' }
const input = { employeeId: employee.id, examType: 'INITIAL' as const, position: employee.position, factorIds: [factor.id, factor.id], resultDeadline: '2026-09-30', preferredCity: 'Warszawa' }

describe('Wystawienie skierowania', () => {
  it('ukrywa numerację, snapshot i status za jednym interface', async () => {
    const persistence = new InMemoryReferralIssuanceAdapter([employee], [factor])
    const issuance = createReferralIssuance({ persistence, now: () => new Date('2026-09-17T08:00:00.000Z'), nextId: () => 'referral-1' })

    const referral = await issuance.issue(input)
    employee.firstName = 'Zmienione'
    factor.name = 'Zmieniony czynnik'

    expect(referral).toMatchObject({ id: 'referral-1', number: 'SK/2026/09/0001', status: 'ISSUED', createdAt: '2026-09-17T08:00:00.000Z' })
    expect(referral.employee.firstName).toBe('Ewa')
    expect(referral.factors).toHaveLength(1)
    expect(referral.factors[0].name).toBe('Praca przy monitorze')
  })

  it('odrzuca termin w przeszłości bez zapisu', async () => {
    const persistence = new InMemoryReferralIssuanceAdapter([employee], [factor])
    const issuance = createReferralIssuance({ persistence, now: () => new Date('2026-09-17T08:00:00.000Z') })

    await expect(issuance.issue({ ...input, resultDeadline: '2026-09-16' })).rejects.toMatchObject({ code: 'DEADLINE_IN_PAST' })
    expect(persistence.referrals()).toEqual([])
  })

  it('odrzuca brakujące czynniki', async () => {
    const persistence = new InMemoryReferralIssuanceAdapter([employee], [])
    const issuance = createReferralIssuance({ persistence, now: () => new Date('2026-09-17T08:00:00.000Z') })

    await expect(issuance.issue(input)).rejects.toMatchObject({ code: 'FACTORS_NOT_FOUND' })
  })

  it('nadaje numer po najwyższym istniejącym suffixie', async () => {
    const existing = [{
      id: 'existing', number: 'SK/2026/09/0012', examType: 'INITIAL' as const, employee,
      position: employee.position, factors: [], resultDeadline: '2026-09-20', preferredCity: 'Warszawa',
      status: 'ISSUED' as const, createdAt: '2026-09-01T08:00:00.000Z',
    }]
    const persistence = new InMemoryReferralIssuanceAdapter([employee], [factor], existing)
    const issuance = createReferralIssuance({ persistence, now: () => new Date('2026-09-17T08:00:00.000Z'), nextId: () => 'referral-13' })

    await expect(issuance.issue(input)).resolves.toMatchObject({ number: 'SK/2026/09/0013' })
  })
})
