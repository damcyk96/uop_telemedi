import { useState } from 'react'
import { LayoutTemplate, Plus } from 'lucide-react'
import type { ReferralTemplate } from '@/domain/types'
import {
  useDeleteReferralTemplate,
  useGetExposureFactors,
  useGetReferralTemplates,
  usePostReferralTemplate,
  usePutReferralTemplate,
} from '@/core/queries'
import { useTranslation } from '@/i18n'
import { uid } from '@/lib/utils'
import { Button, LoadingIndicator } from '@/ui/atoms'
import { EmptyState } from '@/ui/molecules'
import { PageHeader } from '@/ui/organisms'
import { ReferralTemplateCard } from '@/features/templates/components/ReferralTemplateCard'
import { ReferralTemplateDialog } from '@/features/templates/components/ReferralTemplateDialog'

export default function TemplatesPage() {
  const { t } = useTranslation()
  const templatesQuery = useGetReferralTemplates()
  const factorsQuery = useGetExposureFactors()
  const postReferralTemplate = usePostReferralTemplate()
  const putReferralTemplate = usePutReferralTemplate()
  const deleteReferralTemplate = useDeleteReferralTemplate()
  const [editing, setEditing] = useState<ReferralTemplate | null | undefined>()
  const templates = templatesQuery.data || []
  const factors = factorsQuery.data || []

  async function saveTemplate(data: Omit<ReferralTemplate, 'id'>) {
    if (editing) {
      await putReferralTemplate.mutateAsync({ ...data, id: editing.id })
    } else {
      await postReferralTemplate.mutateAsync({ ...data, id: uid() })
    }
    setEditing(undefined)
  }

  function removeTemplate(template: ReferralTemplate) {
    if (confirm(t('templates.page.removeConfirm', { name: template.name }))) {
      deleteReferralTemplate.mutate(template.id)
    }
  }

  function renderTemplate(template: ReferralTemplate) {
    return (
      <ReferralTemplateCard
        key={template.id}
        template={template}
        factors={factors}
        onEdit={setEditing}
        onRemove={removeTemplate}
      />
    )
  }

  const createAction = (
    <Button onClick={() => setEditing(null)}>
      <Plus size={17} aria-hidden="true" />
      {t('templates.page.create')}
    </Button>
  )

  function renderContent() {
    if (templatesQuery.isLoading) {
      return (
        <LoadingIndicator />
      )
    }
    if (!templates.length) {
      return (
        <div className="template-empty">
          <EmptyState icon={LayoutTemplate} title={t('templates.page.emptyTitle')} text={t('templates.page.emptyText')} />
        </div>
      )
    }
    return templates.map(renderTemplate)
  }

  return (
    <>
      <PageHeader
        eyebrow={t('templates.page.eyebrow')}
        title={t('templates.page.title')}
        description={t('templates.page.description')}
        actions={createAction}
      />
      <div className="template-grid">{renderContent()}</div>
      {editing !== undefined && (
        <ReferralTemplateDialog
          template={editing}
          factors={factors}
          onClose={() => setEditing(undefined)}
          onSave={saveTemplate}
        />
      )}
    </>
  )
}
