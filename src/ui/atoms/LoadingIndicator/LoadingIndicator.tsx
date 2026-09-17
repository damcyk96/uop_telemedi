import { useTranslation } from '@/i18n'

export interface LoadingIndicatorProps {
  label?: string
}

export function LoadingIndicator({ label }: LoadingIndicatorProps) {
  const { t } = useTranslation()

  return (
    <div className="loading" role="status">
      <span />
      <span />
      <span />
      <span className="sr-only">{label ?? t('common.loadingData')}</span>
    </div>
  )
}
