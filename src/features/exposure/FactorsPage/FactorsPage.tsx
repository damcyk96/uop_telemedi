import { useState } from 'react'
import type { ExposureFactor, FactorCategory } from '@/domain/types'
import { factorCategories } from '@/domain/catalogs'
import { validateFactorName } from '@/domain/exposureCatalog'
import { useDeleteExposureFactor, useGetExposureFactors, usePostExposureFactor } from '@/core/queries'
import { ExposureCategoryCard } from '@/features/exposure/components/ExposureCategoryCard'
import { useTranslation, type TranslationKey } from '@/i18n'
import { uid } from '@/lib/utils'
import { FieldError, LoadingIndicator } from '@/ui/atoms'
import { Toast } from '@/ui/molecules'
import { PageHeader } from '@/ui/organisms'

export default function FactorsPage() {
  const { t } = useTranslation()
  const factorsQuery = useGetExposureFactors()
  const postExposureFactor = usePostExposureFactor()
  const deleteExposureFactor = useDeleteExposureFactor()
  const [names, setNames] = useState<Partial<Record<FactorCategory, string>>>({})
  const [message, setMessage] = useState('')
  const [errorKey, setErrorKey] = useState<TranslationKey>()
  const factors = factorsQuery.data || []

  async function add(category: FactorCategory) {
    const result = validateFactorName(names[category] || '', category, factors)
    if (!result.ok) {
      setErrorKey(result.messageKey)
      return
    }
    await postExposureFactor.mutateAsync({ id: uid(), category, name: result.name, source: 'CUSTOM' })
    setNames({ ...names, [category]: '' })
    setErrorKey(undefined)
    setMessage(t('exposureFactors.page.created'))
  }

  async function remove(factor: ExposureFactor) {
    if (!confirm(t('exposureFactors.page.removeConfirm', { name: factor.name }))) {
      return
    }
    const result = await deleteExposureFactor.mutateAsync(factor)
    setMessage(result.updatedTemplates
      ? t('exposureFactors.page.removedWithTemplates', { count: result.updatedTemplates })
      : t('exposureFactors.page.removed'))
  }

  function renderCategory(category: FactorCategory, index: number) {
    return (
      <ExposureCategoryCard
        key={category}
        category={category}
        title={t(`domain.factorCategories.${category}.short`)}
        index={index + 1}
        factors={factors.filter(factor => factor.category === category)}
        draftName={names[category] || ''}
        onDraftNameChange={value => setNames({ ...names, [category]: value })}
        onAdd={() => void add(category)}
        onRemove={factor => void remove(factor)}
      />
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={t('exposureFactors.page.eyebrow')}
        title={t('exposureFactors.page.title')}
        description={t('exposureFactors.page.description')}
      />
      {errorKey && <div className="page-error"><FieldError message={t(errorKey)} /></div>}
      {factorsQuery.isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className="factor-grid">{factorCategories.map(renderCategory)}</div>
      )}
      {message && <Toast message={message} onDone={() => setMessage('')} />}
    </>
  )
}
