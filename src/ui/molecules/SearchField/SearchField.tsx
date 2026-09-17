import { Search } from 'lucide-react'
import { TextInput } from '@/ui/atoms'

export interface SearchFieldProps {
  label: string
  placeholder: string
  value: string
  onValueChange: (value: string) => void
}

export function SearchField({ label, placeholder, value, onValueChange }: SearchFieldProps) {
  return (
    <label className="search">
      <span className="sr-only">{label}</span>
      <Search size={18} aria-hidden="true" />
      <TextInput type="search" placeholder={placeholder} value={value} onValueChange={onValueChange} />
    </label>
  )
}
