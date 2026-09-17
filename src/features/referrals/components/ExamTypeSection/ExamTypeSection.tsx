import { examTypes } from '@/domain/catalogs'
import type { ExamType } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { ChoiceCard } from '@/ui/molecules'
import { FormSection } from '@/ui/organisms'

export interface ExamTypeSectionProps {
  examType: ExamType
  onChange: (examType: ExamType) => void
}

export function ExamTypeSection({ examType, onChange }: ExamTypeSectionProps) {
  const { t } = useTranslation()

  function renderExamType(type: ExamType, index: number) {
    return (
      <ChoiceCard
        key={type}
        name="examType"
        ordinal={String(index + 1).padStart(2, '0')}
        title={t(`domain.examTypes.${type}`)}
        hint={t(`domain.examTypeHints.${type}`)}
        selected={examType === type}
        onSelect={() => onChange(type)}
      />
    )
  }

  return (
    <FormSection number="01" title={t('referrals.form.examType.title')} hint={t('referrals.form.examType.hint')}>
      <div className="exam-grid">{examTypes.map(renderExamType)}</div>
    </FormSection>
  )
}
