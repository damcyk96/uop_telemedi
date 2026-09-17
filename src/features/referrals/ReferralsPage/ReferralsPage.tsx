import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Referral } from '@/domain/types'
import { useGetCompany, useGetReferrals } from '@/core/queries'
import { LoadingIndicator } from '@/ui/atoms'
import { Toast } from '@/ui/molecules'
import { Modal, PageHeader } from '@/ui/organisms'
import { ReferralMetrics } from '@/features/referrals/components/ReferralMetrics'
import { ReferralsTable } from '@/features/referrals/components/ReferralsTable'
import { useTranslation } from '@/i18n'

const ReferralPreview = lazy(() => import('@/features/referrals/components/ReferralPreview'))

interface ReferralsLocationState {
  previewId?: string
}

export default function ReferralsPage() {
  const { t } = useTranslation()
  const referrals = useGetReferrals()
  const company = useGetCompany()
  const location = useLocation()
  const createdId = (location.state as ReferralsLocationState | null)?.previewId
  const [preview, setPreview] = useState<Referral | null>(null)
  const [showCreated, setShowCreated] = useState(Boolean(createdId))
  const rows = useMemo(
    () => [...(referrals.data || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [referrals.data],
  )

  useEffect(() => {
    if (createdId && rows.length) {
      setPreview(rows.find(referral => referral.id === createdId) || null)
    }
  }, [createdId, rows])

  return (
    <>
      <PageHeader
        eyebrow={t('referrals.page.eyebrow')}
        title={t('referrals.page.title')}
        description={t('referrals.page.description')}
      />
      <ReferralMetrics referrals={rows} />
      <ReferralsTable referrals={rows} loading={referrals.isLoading} onPreview={setPreview} />
      {preview && company.data && (
        <Modal wide title={t('referrals.page.previewTitle', { number: preview.number })} onClose={() => setPreview(null)}>
          <Suspense fallback={<LoadingIndicator />}>
            <ReferralPreview referral={preview} company={company.data} />
          </Suspense>
        </Modal>
      )}
      {showCreated && (
        <Toast message={t('referrals.page.issued')} onDone={() => setShowCreated(false)} />
      )}
    </>
  )
}
