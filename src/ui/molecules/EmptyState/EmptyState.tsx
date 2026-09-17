import type { LucideIcon } from 'lucide-react'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  text: string
}

export function EmptyState({ icon: Icon, title, text }: EmptyStateProps) {
  return (
    <div className="empty">
      <span aria-hidden="true"><Icon /></span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}
