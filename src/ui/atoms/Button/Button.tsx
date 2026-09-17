import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'plain'
  compact?: boolean
}

export function Button({ variant = 'primary', compact = false, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={variant === 'plain' ? className : cn('button', variant, compact && 'compact', className)} {...props} />
  )
}
