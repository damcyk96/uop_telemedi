import { Plus } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import type { ExposureFactor, FactorCategory } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { IconButton, TextInput } from '@/ui/atoms'
import { ExposureFactorItem } from '@/features/exposure/components/ExposureFactorItem'

export interface ExposureCategoryCardProps {
  category: FactorCategory
  title: string
  index: number
  factors: ExposureFactor[]
  draftName: string
  onDraftNameChange: (value: string) => void
  onAdd: () => void
  onRemove: (factor: ExposureFactor) => void
}

export function ExposureCategoryCard({ category, title, index, factors, draftName, onDraftNameChange, onAdd, onRemove }: ExposureCategoryCardProps) {
  const { t } = useTranslation()
  const inputId = `factor-${category}`

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onAdd()
    }
  }

  function renderFactor(factor: ExposureFactor) {
    return (
      <ExposureFactorItem key={factor.id} factor={factor} onRemove={onRemove} />
    )
  }

  return (
    <section className="factor-card">
      <header>
        <span className="roman" aria-hidden="true">{String(index).padStart(2, '0')}</span>
        <div>
          <h2>{title}</h2>
          <p>{t('exposureFactors.card.count', { count: factors.length })}</p>
        </div>
      </header>
      <div className="factor-list">
        {factors.length ? factors.map(renderFactor) : <p className="muted-row">{t('exposureFactors.card.empty')}</p>}
      </div>
      <div className="inline-add">
        <label className="sr-only" htmlFor={inputId}>{t('exposureFactors.card.newFactorLabel', { category: title })}</label>
        <TextInput
          id={inputId}
          placeholder={t('exposureFactors.card.newFactorPlaceholder')}
          value={draftName}
          onValueChange={onDraftNameChange}
          onKeyDown={handleKeyDown}
        />
        <IconButton icon={Plus} label={t('exposureFactors.card.addLabel', { category: title })} onClick={onAdd} />
      </div>
    </section>
  )
}
