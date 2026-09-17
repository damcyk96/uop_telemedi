import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'children'> {
  value?: string
  options: SelectOption[]
  placeholder?: string
  onValueChange: (value: string) => void
}

export function Select({ options, placeholder, onValueChange, ...props }: SelectProps) {
  function renderOption(option: SelectOption) {
    return (
      <option key={option.value} value={option.value}>{option.label}</option>
    )
  }

  return (
    <select onChange={event => onValueChange(event.target.value)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(renderOption)}
    </select>
  )
}
