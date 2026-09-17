import type { ReactNode } from 'react'
import { useTranslation } from '@/i18n'

export interface FormFieldProps {
  label: string
  optional?: boolean
  children: ReactNode
}

export function FormField({ label, optional = false, children }: FormFieldProps) {
  const { t } = useTranslation()

  return (
    <label>
      {label}
      {optional && <> <em>{t('common.optional')}</em></>}
      {children}
    </label>
  )
}
