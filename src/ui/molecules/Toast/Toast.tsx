import { useEffect, useRef } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ToastProps {
  message: string
  onDone: () => void
  variant?: 'success' | 'error'
  duration?: number
}

export function Toast({ message, onDone, variant = 'success', duration = 3500 }: ToastProps) {
  // Parents usually pass an inline callback; keeping it in a ref stops re-renders from restarting the timer.
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const Icon = variant === 'error' ? X : Check

  useEffect(() => {
    const timeout = setTimeout(() => onDoneRef.current(), duration)
    return () => {
      clearTimeout(timeout)
    }
  }, [message, duration])

  return (
    <div className={cn('toast', variant === 'error' && 'error')} role="status" aria-live="polite">
      <Icon size={18} aria-hidden="true" />
      {message}
    </div>
  )
}
