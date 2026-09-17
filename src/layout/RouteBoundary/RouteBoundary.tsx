import { Suspense, type ReactNode } from 'react'
import { LoadingIndicator } from '@/ui/atoms'

export interface RouteBoundaryProps {
  children: ReactNode
}

export function RouteBoundary({ children }: RouteBoundaryProps) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      {children}
    </Suspense>
  )
}
