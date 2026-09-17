import type { ExposureFactor, ReferralTemplate } from '@/domain/types'
import { ExposureFactorChecklist } from '@/features/exposure/components/ExposureFactorChecklist'
import { useTranslation } from '@/i18n'
import { Select, TextArea } from '@/ui/atoms'
import { FormField } from '@/ui/molecules'
import { FormSection } from '@/ui/organisms'

export interface ExposureFactorsSectionProps {
  factors: ExposureFactor[]
  templates: ReferralTemplate[]
  selectedIds: string[]
  workConditions: string
  onTemplateChange: (templateId: string) => void
  onFactorToggle: (factorId: string) => void
  onWorkConditionsChange: (value: string) => void
}

export function ExposureFactorsSection({
  factors,
  templates,
  selectedIds,
  workConditions,
  onTemplateChange,
  onFactorToggle,
  onWorkConditionsChange,
}: ExposureFactorsSectionProps) {
  const { t } = useTranslation()
  const templateOptions = templates.map(template => ({ value: template.id, label: template.name }))

  return (
    <FormSection number="03" title={t('referrals.form.factors.title')} hint={t('referrals.form.factors.hint')}>
      <FormField label={t('referrals.form.factors.template')}>
        <Select
          defaultValue=""
          placeholder={t('referrals.form.factors.templatePlaceholder')}
          options={templateOptions}
          onValueChange={onTemplateChange}
        />
      </FormField>
      <ExposureFactorChecklist
        layout="form"
        factors={factors}
        selectedIds={selectedIds}
        onToggle={onFactorToggle}
        emptyCategoryText={t('referrals.form.factors.emptyCategory')}
      />
      <div className="factor-total">
        {t('referrals.form.factors.total')} <strong>{selectedIds.length}</strong>
      </div>
      <FormField label={t('referrals.form.factors.workConditions')} optional>
        <TextArea
          value={workConditions}
          onValueChange={onWorkConditionsChange}
          placeholder={t('referrals.form.factors.workConditionsPlaceholder')}
        />
      </FormField>
    </FormSection>
  )
}
