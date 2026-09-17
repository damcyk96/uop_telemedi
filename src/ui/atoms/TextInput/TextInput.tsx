import type { InputHTMLAttributes } from 'react'

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string
  onValueChange: (value: string) => void
}

export function TextInput({ value, onValueChange, ...props }: TextInputProps) {
  return (
    <input value={value} onChange={event => onValueChange(event.target.value)} {...props} />
  )
}
