import type { User } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { Avatar } from '@/ui/atoms'

export interface CoordinatorSummaryProps {
  coordinator?: User
}

export function CoordinatorSummary({ coordinator }: CoordinatorSummaryProps) {
  const { t, translations } = useTranslation()
  const { firstName, lastName } = coordinator ?? translations.layout.topBar.coordinatorPlaceholder

  return (
    <>
      <Avatar firstName={firstName} lastName={lastName} size="md" />
      <div className="user-label">
        <strong>{firstName} {lastName}</strong>
        <span>{t('layout.topBar.coordinatorRole')}</span>
      </div>
    </>
  )
}
