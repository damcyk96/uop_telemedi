import { useTranslation } from '@/i18n'

export function EnvironmentNotice() {
  const { t } = useTranslation()

  return (
    <div className="sidebar-foot">
      <span className="pulse-dot" aria-hidden="true" />
      <strong>{t('layout.environment.title')}</strong>
      <small>{t('layout.environment.description')}</small>
    </div>
  )
}
