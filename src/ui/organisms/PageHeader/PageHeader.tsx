import { useEffect, type ReactNode } from 'react'
import { useTranslation } from '@/i18n'

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = t('common.documentTitle', { title })
  }, [t, title])

  return (
    <div className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="header-actions">{actions}</div>}
    </div>
  )
}
