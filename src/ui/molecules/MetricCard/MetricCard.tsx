import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface MetricCardProps {
  icon: LucideIcon
  tone: 'green' | 'yellow' | 'teal'
  label: string
  value: number
}

export function MetricCard({ icon: Icon, tone, label, value }: MetricCardProps) {
  return (
    <div>
      <span className={cn('metric-icon', tone)} aria-hidden="true"><Icon /></span>
      <p>{label}<strong>{value}</strong></p>
    </div>
  )
}
