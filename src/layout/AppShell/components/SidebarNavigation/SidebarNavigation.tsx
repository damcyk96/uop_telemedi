import type { LucideIcon } from 'lucide-react'
import { useTranslation, type TranslationKey } from '@/i18n'
import { NavigationItem } from '@/layout/AppShell/components/NavigationItem'
import { TelemediBrand } from '@/layout/AppShell/components/TelemediBrand'

export interface NavigationEntry {
  to: string
  icon: LucideIcon
  labelKey: TranslationKey
}

export interface SidebarNavigationProps {
  entries: NavigationEntry[]
  onNavigate: () => void
}

export function SidebarNavigation({ entries, onNavigate }: SidebarNavigationProps) {
  const { t } = useTranslation()

  function renderNavigationItem(entry: NavigationEntry) {
    return (
      <NavigationItem
        key={entry.to}
        to={entry.to}
        icon={entry.icon}
        label={t(entry.labelKey)}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <>
      <TelemediBrand />
      <div className="workspace-label">{t('layout.workspace')}</div>
      <nav aria-label={t('layout.modulesNavigation')}>{entries.map(renderNavigationItem)}</nav>
    </>
  )
}
