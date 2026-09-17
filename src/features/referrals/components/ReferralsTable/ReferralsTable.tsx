import { BriefcaseMedical, CalendarDays, Eye } from 'lucide-react'
import type { Referral } from '@/domain/types'
import { ReferralStatus } from '@/features/referrals/components/ReferralStatus'
import { useTranslation } from '@/i18n'
import { datePL } from '@/lib/utils'
import { Button } from '@/ui/atoms'
import { DataTable, type DataTableColumn } from '@/ui/organisms'

export interface ReferralsTableProps {
  referrals: Referral[]
  loading: boolean
  onPreview: (referral: Referral) => void
}

export function ReferralsTable({ referrals, loading, onPreview }: ReferralsTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn[] = [
    { header: t('referrals.table.columns.number') },
    { header: t('referrals.table.columns.employee') },
    { header: t('referrals.table.columns.examType') },
    { header: t('referrals.table.columns.issuedAt') },
    { header: t('referrals.table.columns.deadline') },
    { header: t('referrals.table.columns.status') },
    { header: t('referrals.table.columns.document'), align: 'right' },
  ]

  function renderReferral(referral: Referral) {
    return (
      <tr key={referral.id}>
        <td className="mono strong">{referral.number}</td>
        <td>
          <div>
            <strong>{referral.employee.firstName} {referral.employee.lastName}</strong>
            <small className="cell-sub">{referral.position}</small>
          </div>
        </td>
        <td>{t(`domain.examTypes.${referral.examType}`)}</td>
        <td>{datePL(referral.createdAt) ?? t('common.emptyValue')}</td>
        <td>
          <span className="deadline-cell">
            <CalendarDays aria-hidden="true" />
            {datePL(`${referral.resultDeadline}T12:00:00`) ?? t('common.emptyValue')}
          </span>
        </td>
        <td><ReferralStatus status={referral.status} /></td>
        <td>
          <Button
            variant="plain"
            className="view-button"
            aria-label={t('referrals.table.previewLabel', { number: referral.number })}
            onClick={() => onPreview(referral)}
          >
            <Eye aria-hidden="true" />
            {t('referrals.table.preview')}
          </Button>
        </td>
      </tr>
    )
  }

  return (
    <DataTable
      label={t('referrals.table.label')}
      caption={t('referrals.table.caption')}
      columns={columns}
      rows={referrals}
      loading={loading}
      empty={{ icon: BriefcaseMedical, title: t('referrals.table.emptyTitle'), text: t('referrals.table.emptyText') }}
      renderRow={renderReferral}
    />
  )
}
