const sizeClassNames = {
  sm: 'mini-avatar',
  md: 'avatar',
  lg: 'large-avatar',
} as const

export interface AvatarProps {
  firstName: string
  lastName: string
  size?: keyof typeof sizeClassNames
}

export function Avatar({ firstName, lastName, size = 'sm' }: AvatarProps) {
  return (
    <span className={sizeClassNames[size]} aria-hidden="true">
      {firstName[0]}{lastName[0]}
    </span>
  )
}
