import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  icon: LucideIcon
  label: string
  tone?: 'default' | 'danger'
  iconSize?: number
}

export function IconButton({ icon: Icon, label, tone = 'default', iconSize, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button type={type} className={cn(tone === 'danger' && 'danger-icon', className)} aria-label={label} {...props}>
      <Icon size={iconSize} aria-hidden="true" />
    </button>
  )
}
