import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface BadgeProps {
  kind: 'status' | 'role'
  tone?: string
  dot?: boolean
  children: ReactNode
}

export function Badge({ kind, tone, dot = false, children }: BadgeProps) {
  return (
    <span className={cn(kind, tone)}>
      {dot && <i />}
      {children}
    </span>
  )
}
