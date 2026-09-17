import type { ReactNode } from 'react'

export interface SwitchProps {
  label: ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ label, checked, onCheckedChange }: SwitchProps) {
  return (
    <label className="toggle-row">
      <input type="checkbox" checked={checked} onChange={event => onCheckedChange(event.target.checked)} />
      <span />
      {label}
    </label>
  )
}
