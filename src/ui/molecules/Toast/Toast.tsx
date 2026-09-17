import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

export interface ToastProps {
  message: string
  onDone: () => void
  duration?: number
}

export function Toast({ message, onDone, duration = 3500 }: ToastProps) {
  // Parents usually pass an inline callback; keeping it in a ref stops re-renders from restarting the timer.
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const timeout = setTimeout(() => onDoneRef.current(), duration)
    return () => {
      clearTimeout(timeout)
    }
  }, [message, duration])

  return (
    <div className="toast" role="status" aria-live="polite">
      <Check size={18} aria-hidden="true" />
      {message}
    </div>
  )
}
