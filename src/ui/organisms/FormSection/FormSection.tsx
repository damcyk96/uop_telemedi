import type { ReactNode } from 'react'

export interface FormSectionProps {
  number: string
  title: string
  hint: string
  children: ReactNode
}

export function FormSection({ number, title, hint, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <header>
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{hint}</p>
        </div>
      </header>
      <div className="form-section-body form">{children}</div>
    </section>
  )
}
