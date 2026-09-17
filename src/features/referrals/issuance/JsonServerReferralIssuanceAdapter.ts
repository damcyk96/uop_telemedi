import type { Referral } from '@/domain/types'
import { getEmployees, getExposureFactors, getReferrals, postReferral } from '@/core/api'
import type { ReferralIssuancePersistence } from './ReferralIssuance'

export class JsonServerReferralIssuanceAdapter implements ReferralIssuancePersistence {
  async load({ employeeId, factorIds }: { employeeId: string; factorIds: readonly string[] }) {
    const [employees, factors, referrals] = await Promise.all([
      getEmployees(),
      getExposureFactors(),
      getReferrals(),
    ])
    const ids = new Set(factorIds)
    return {
      employee: employees.find(employee => employee.id === employeeId),
      factors: factors.filter(factor => ids.has(factor.id)),
      existingNumbers: referrals.map(referral => referral.number),
    }
  }

  append(referral: Referral) {
    return postReferral(referral)
  }
}
