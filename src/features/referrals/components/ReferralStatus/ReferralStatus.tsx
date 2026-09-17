import type { ReferralStatus as ReferralStatusValue } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { Badge } from '@/ui/atoms'

export interface ReferralStatusProps {
  status: ReferralStatusValue
}

export function ReferralStatus({ status }: ReferralStatusProps) {
  const { t } = useTranslation()

  return (
    <Badge kind="status" tone={status.toLowerCase()} dot>
      {t(`domain.referralStatuses.${status}`)}
    </Badge>
  )
}
