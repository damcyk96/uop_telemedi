import { Building2, Menu, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { Button, IconButton } from '@/ui/atoms'
import { CoordinatorSummary } from '../CoordinatorSummary'

export interface TopBarProps {
  companyName?: string
  coordinator?: User
  menuOpen: boolean
  showNewReferralAction: boolean
  onOpenMenu: () => void
}

export function TopBar({
  companyName,
  coordinator,
  menuOpen,
  showNewReferralAction,
  onOpenMenu,
}: TopBarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <IconButton
        className="icon-button mobile-menu"
        icon={Menu}
        label={t('layout.openMenu')}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={onOpenMenu}
      />
      <div className="company">
        <Building2 size={17} aria-hidden="true" />
        <span>{companyName || t('common.loading')}</span>
      </div>
      <div className="top-actions">
        {showNewReferralAction && (
          <Button compact onClick={() => navigate('/skierowania/nowe')}>
            <Plus size={17} aria-hidden="true" />
            {t('layout.topBar.newReferral')}
          </Button>
        )}
        <CoordinatorSummary coordinator={coordinator} />
      </div>
    </header>
  )
}
