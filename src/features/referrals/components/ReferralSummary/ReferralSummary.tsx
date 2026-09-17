import { ChevronRight, ShieldAlert } from 'lucide-react'
import type { Employee, ExamType } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { datePL } from '@/lib/utils'
import { Button, FieldError } from '@/ui/atoms'
import { SummaryRow } from '@/ui/molecules'

export interface ReferralSummaryProps {
  examType: ExamType
  employee?: Employee
  factorCount: number
  resultDeadline: string
  error?: string
  submitting: boolean
}

export function ReferralSummary({
  examType,
  employee,
  factorCount,
  resultDeadline,
  error,
  submitting,
}: ReferralSummaryProps) {
  const { t } = useTranslation()
  const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : t('referrals.summary.notSelected')
  const deadlineLabel = resultDeadline
    ? datePL(`${resultDeadline}T12:00:00`)
    : t('referrals.summary.notSet')

  return (
    <aside className="referral-side">
      <div className="summary-card">
        <span className="eyebrow">{t('referrals.summary.eyebrow')}</span>
        <h2>{t('referrals.summary.title')}</h2>
        <SummaryRow label={t('referrals.summary.examType')} value={t(`domain.examTypes.${examType}`)} />
        <SummaryRow label={t('referrals.summary.employee')} value={employeeName} />
        <SummaryRow label={t('referrals.summary.factors')} value={`${factorCount}`} />
        <SummaryRow label={t('referrals.summary.deadline')} value={deadlineLabel} />
        <div className="summary-note">
          <ShieldAlert aria-hidden="true" />
          <p>{t('referrals.summary.readOnlyNote')}</p>
        </div>
        <FieldError message={error} />
        <Button type="submit" className="generate" disabled={submitting}>
          {t(submitting ? 'referrals.summary.submitting' : 'referrals.summary.submit')}
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </aside>
  )
}
