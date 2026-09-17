import type { ExposureFactor, FactorCategory } from '@/domain/types'
import { factorCategories } from '@/domain/catalogs'
import { useTranslation } from '@/i18n'
import { Checkbox } from '@/ui/atoms'

export interface ExposureFactorChecklistProps {
  factors: ExposureFactor[]
  selectedIds: string[]
  onToggle: (id: string) => void
  layout?: 'dialog' | 'form'
  emptyCategoryText?: string
}

const layoutClassNames = { dialog: 'factor-checks', form: 'referral-factors' } as const

export function ExposureFactorChecklist({
  factors,
  selectedIds,
  onToggle,
  layout = 'dialog',
  emptyCategoryText,
}: ExposureFactorChecklistProps) {
  const { t } = useTranslation()

  function renderFactor(factor: ExposureFactor) {
    return (
      <Checkbox
        key={factor.id}
        label={factor.name}
        checked={selectedIds.includes(factor.id)}
        onCheckedChange={() => onToggle(factor.id)}
      />
    )
  }

  function renderCategory(category: FactorCategory) {
    const categoryFactors = factors.filter(factor => factor.category === category)
    const emptyText = !categoryFactors.length && emptyCategoryText
      ? <small>{emptyCategoryText}</small>
      : null

    return (
      <div key={category}>
        <strong>{t(`domain.factorCategories.${category}.label`)}</strong>
        {categoryFactors.map(renderFactor)}
        {emptyText}
      </div>
    )
  }

  return (
    <div className={layoutClassNames[layout]}>{factorCategories.map(renderCategory)}</div>
  )
}
