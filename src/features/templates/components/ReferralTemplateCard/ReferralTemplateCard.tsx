import { LayoutTemplate, Pencil, Trash2 } from 'lucide-react'
import type { ExposureFactor, ReferralTemplate } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { IconButton } from '@/ui/atoms'

export interface ReferralTemplateCardProps {
  template: ReferralTemplate
  factors: ExposureFactor[]
  onEdit: (template: ReferralTemplate) => void
  onRemove: (template: ReferralTemplate) => void
}

export function ReferralTemplateCard({ template, factors, onEdit, onRemove }: ReferralTemplateCardProps) {
  const { t } = useTranslation()

  function renderFactorName(id: string) {
    const name = factors.find(factor => factor.id === id)?.name || t('templates.card.unavailableFactor')
    return (
      <span key={id}>{name}</span>
    )
  }

  return (
    <article className="template-card">
      <div className="template-icon" aria-hidden="true"><LayoutTemplate /></div>
      <div className="template-copy">
        <h2>{template.name}</h2>
        <p>{t('templates.card.factorCount', { count: template.factorIds.length })}</p>
        <div className="chips">{template.factorIds.map(renderFactorName)}</div>
      </div>
      <div className="card-actions">
        <IconButton icon={Pencil} label={t('templates.card.editLabel', { name: template.name })} onClick={() => onEdit(template)} />
        <IconButton icon={Trash2} label={t('templates.card.removeLabel', { name: template.name })} onClick={() => onRemove(template)} />
      </div>
    </article>
  )
}
