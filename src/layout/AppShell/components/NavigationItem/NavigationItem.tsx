import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export interface NavigationItemProps {
  to: string
  icon: LucideIcon
  label: string
  onNavigate: () => void
}

export function NavigationItem({ to, icon: Icon, label, onNavigate }: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) => isActive ? 'active' : ''}
    >
      <Icon size={19} aria-hidden="true" />
      <span>{label}</span>
      <ChevronRight className="nav-arrow" size={15} aria-hidden="true" />
    </NavLink>
  )
}
