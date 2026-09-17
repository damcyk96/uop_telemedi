import { BriefcaseMedical, CalendarDays, MapPin } from 'lucide-react'
import type { Referral } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { MetricCard } from '@/ui/molecules'

export interface ReferralMetricsProps {
  referrals: Referral[]
}

export function ReferralMetrics({ referrals }: ReferralMetricsProps) {
  const { t } = useTranslation()
  const inProgress = referrals.filter(referral => referral.status === 'IN_PROGRESS').length
  const scheduled = referrals.filter(referral => referral.status === 'SCHEDULED').length

  return (
    <div className="metrics">
      <MetricCard icon={BriefcaseMedical} tone="green" label={t('referrals.metrics.all')} value={referrals.length} />
      <MetricCard icon={CalendarDays} tone="yellow" label={t('referrals.metrics.inProgress')} value={inProgress} />
      <MetricCard icon={MapPin} tone="teal" label={t('referrals.metrics.scheduled')} value={scheduled} />
    </div>
  )
}
