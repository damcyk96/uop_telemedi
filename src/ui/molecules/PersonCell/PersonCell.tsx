import { Avatar } from '@/ui/atoms'

export interface PersonCellProps {
  firstName: string
  lastName: string
  subtitle?: string
}

export function PersonCell({ firstName, lastName, subtitle }: PersonCellProps) {
  const name = (
    <strong>{firstName} {lastName}</strong>
  )

  return (
    <div className="person">
      <Avatar firstName={firstName} lastName={lastName} />
      {subtitle === undefined ? name : <div>{name}<small>{subtitle}</small></div>}
    </div>
  )
}
