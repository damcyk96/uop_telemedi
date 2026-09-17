import { PDFViewer } from '@react-pdf/renderer'
import type { Company, Referral } from '@/domain/types'
import { ReferralPdf } from '@/features/referrals/pdf/ReferralPdf'
import { useTranslation } from '@/i18n'

export interface ReferralPreviewProps {
  referral: Referral
  company: Company
}

export default function ReferralPreview({ referral, company }: ReferralPreviewProps) {
  // PDFViewer renders the document with its own reconciler, so React context does not reach it.
  const { t } = useTranslation()

  return (
    <div className="pdf-shell">
      <PDFViewer width="100%" height="100%" showToolbar>
        <ReferralPdf referral={referral} company={company} t={t} />
      </PDFViewer>
    </div>
  )
}
