import { cn } from '@/lib/cn'

export interface ChoiceCardProps {
  name: string
  ordinal: string
  title: string
  hint: string
  selected: boolean
  onSelect: () => void
}

export function ChoiceCard({ name, ordinal, title, hint, selected, onSelect }: ChoiceCardProps) {
  return (
    <label className={cn('exam-option', selected && 'selected')}>
      <input type="radio" name={name} checked={selected} onChange={onSelect} />
      <span>{ordinal}</span>
      <div>
        <strong>{title}</strong>
        <small>{hint}</small>
      </div>
      <i />
    </label>
  )
}
