import { useTranslation } from '@/i18n'

export function TelemediBrand() {
  const { t } = useTranslation()

  return (
    <div className="brand-logo" aria-label={t('layout.brand.name')}>
      <svg viewBox="0 0 44 28" aria-hidden="true">
        <circle cx="9" cy="8" r="5" />
        <circle cx="18" cy="17" r="4" />
        <circle cx="30" cy="19" r="6" />
        <path d="M5 13c2 9 9 12 17 8M23 20h2" />
      </svg>
      <span>
        {t('layout.brand.name')}
        <small>{t('layout.brand.subtitle')}</small>
      </span>
    </div>
  )
}
