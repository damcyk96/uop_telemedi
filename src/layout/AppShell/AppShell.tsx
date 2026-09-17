import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BriefcaseMedical, LayoutTemplate, ShieldAlert, UserCog, Users } from 'lucide-react'
import { useGetCompany, useGetUsers } from '@/core/queries'
import { useTranslation } from '@/i18n'
import { EnvironmentNotice } from './components/EnvironmentNotice'
import { SidebarNavigation, type NavigationEntry } from './components/SidebarNavigation'
import { TopBar } from './components/TopBar'

const navigation: NavigationEntry[] = [
  { to: '/skierowania', icon: BriefcaseMedical, labelKey: 'layout.navigation.referrals' },
  { to: '/pracownicy', icon: Users, labelKey: 'layout.navigation.employees' },
  { to: '/czynniki', icon: ShieldAlert, labelKey: 'layout.navigation.exposureFactors' },
  { to: '/szablony', icon: LayoutTemplate, labelKey: 'layout.navigation.templates' },
  { to: '/uzytkownicy', icon: UserCog, labelKey: 'layout.navigation.users' },
]

export function AppShell() {
  const { t } = useTranslation()
  const location = useLocation()
  const users = useGetUsers()
  const company = useGetCompany()
  const coordinator = users.data?.find(user => user.role === 'COORDINATOR')
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(false)
    document.querySelector<HTMLElement>('#main-content')?.focus()
  }, [location.pathname])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">{t('layout.skipToContent')}</a>
      <aside
        id="main-navigation"
        aria-label={t('layout.mainNavigation')}
        className={mobile ? 'sidebar open' : 'sidebar'}
      >
        <SidebarNavigation entries={navigation} onNavigate={() => setMobile(false)} />
        <EnvironmentNotice />
      </aside>

      {mobile && (
        <button type="button" className="backdrop" aria-label={t('layout.closeMenu')} onClick={() => setMobile(false)} />
      )}

      <main id="main-content" className="main" tabIndex={-1}>
        <TopBar
          companyName={company.data?.name}
          coordinator={coordinator}
          menuOpen={mobile}
          showNewReferralAction={location.pathname !== '/skierowania/nowe'}
          onOpenMenu={() => setMobile(true)}
        />
        <div className="page-wrap"><Outlet /></div>
      </main>
    </div>
  )
}
