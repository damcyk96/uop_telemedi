import { LockKeyhole, X } from 'lucide-react'
import type { ExposureFactor } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { IconButton } from '@/ui/atoms'

export interface ExposureFactorItemProps {
  factor: ExposureFactor
  onRemove: (factor: ExposureFactor) => void
}

export function ExposureFactorItem({ factor, onRemove }: ExposureFactorItemProps) {
  const { t } = useTranslation()

  const source = factor.source === 'SYSTEM' ? (
    <small><LockKeyhole aria-hidden="true" /> {t('domain.factorSources.SYSTEM')}</small>
  ) : (
    <>
      <small className="custom-dot">{t('domain.factorSources.CUSTOM')}</small>
      <IconButton
        icon={X}
        label={t('exposureFactors.card.removeLabel', { name: factor.name })}
        title={t('common.remove')}
        onClick={() => onRemove(factor)}
      />
    </>
  )

  return (
    <div className="factor-item">
      <span>{factor.name}</span>
      {source}
    </div>
  )
}
