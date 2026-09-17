import { useState, type FormEvent } from 'react'
import type { ExposureFactor, ReferralTemplate } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { Button, TextInput } from '@/ui/atoms'
import { FormField } from '@/ui/molecules'
import { Modal } from '@/ui/organisms'
import { ExposureFactorChecklist } from '@/features/exposure/components/ExposureFactorChecklist'

export interface ReferralTemplateDialogProps {
  template: ReferralTemplate | null
  factors: ExposureFactor[]
  onClose: () => void
  onSave: (data: Omit<ReferralTemplate, 'id'>) => Promise<void>
}

export function ReferralTemplateDialog({ template, factors, onClose, onSave }: ReferralTemplateDialogProps) {
  const { t } = useTranslation()
  const [name, setName] = useState(template?.name || '')
  const [selectedIds, setSelectedIds] = useState(template?.factorIds || [])

  function toggle(id: string) {
    setSelectedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    await onSave({ name: name.trim(), factorIds: selectedIds })
  }

  return (
    <Modal title={t(template ? 'templates.dialog.editTitle' : 'templates.dialog.createTitle')} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <FormField label={t('templates.dialog.name')}>
          <TextInput autoFocus required value={name} onValueChange={setName} placeholder={t('templates.dialog.namePlaceholder')} />
        </FormField>
        <div className="section-label">
          {t('templates.dialog.factors')}
          <span>{t('templates.dialog.selectedCount', { count: selectedIds.length })}</span>
        </div>
        <ExposureFactorChecklist factors={factors} selectedIds={selectedIds} onToggle={toggle} />
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit">{t('templates.dialog.submit')}</Button>
        </div>
      </form>
    </Modal>
  )
}
