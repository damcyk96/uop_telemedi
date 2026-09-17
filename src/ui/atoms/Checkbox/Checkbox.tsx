import type { ReactNode } from 'react'

export interface CheckboxProps {
  label: ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Checkbox({ label, checked, onCheckedChange }: CheckboxProps) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={event => onCheckedChange(event.target.checked)} />
      <span />
      {label}
    </label>
  )
}
