import type { TextareaHTMLAttributes } from 'react'

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: string
  onValueChange: (value: string) => void
}

export function TextArea({ value, onValueChange, rows = 3, ...props }: TextAreaProps) {
  return (
    <textarea rows={rows} value={value} onChange={event => onValueChange(event.target.value)} {...props} />
  )
}
