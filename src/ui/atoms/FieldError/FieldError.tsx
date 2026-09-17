export interface FieldErrorProps {
  message?: string
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null
  }

  return (
    <span className="field-error" role="alert">
      {message}
    </span>
  )
}
