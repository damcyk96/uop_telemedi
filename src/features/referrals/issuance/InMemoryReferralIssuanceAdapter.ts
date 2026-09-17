import type { Employee, ExposureFactor, Referral } from '@/domain/types'
import type { ReferralIssuancePersistence } from './ReferralIssuance'

export class InMemoryReferralIssuanceAdapter implements ReferralIssuancePersistence {
  private readonly saved: Referral[]

  constructor(private readonly employees: Employee[], private readonly factors: ExposureFactor[], referrals: Referral[] = []) {
    this.saved = structuredClone(referrals)
  }

  async load({ employeeId, factorIds }: { employeeId: string; factorIds: readonly string[] }) {
    const ids = new Set(factorIds)
    return {
      employee: structuredClone(this.employees.find(employee => employee.id === employeeId)),
      factors: structuredClone(this.factors.filter(factor => ids.has(factor.id))),
      existingNumbers: this.saved.map(referral => referral.number),
    }
  }

  async append(referral: Referral) {
    if (this.saved.some(item => item.id === referral.id || item.number === referral.number)) {
      throw new Error('conflict')
    }
    const saved = structuredClone(referral)
    this.saved.push(saved)
    return structuredClone(saved)
  }

  referrals() {
    return structuredClone(this.saved)
  }
}
