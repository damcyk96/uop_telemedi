import type { FormEvent } from 'react'
import { CalendarDays } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { TextArea, TextInput } from '@/ui/atoms'
import { FormField } from '@/ui/molecules'
import { FormSection } from '@/ui/organisms'

export interface AppointmentSectionProps {
  minDate: string
  deadlineInPast: boolean
  onDeadlineBeforeMin: () => void
  resultDeadline: string
  preferredCity: string
  notes: string
  onResultDeadlineChange: (value: string) => void
  onPreferredCityChange: (value: string) => void
  onNotesChange: (value: string) => void
}

export function AppointmentSection({
  minDate,
  deadlineInPast,
  onDeadlineBeforeMin,
  resultDeadline,
  preferredCity,
  notes,
  onResultDeadlineChange,
  onPreferredCityChange,
  onNotesChange,
}: AppointmentSectionProps) {
  const { t } = useTranslation()

  function handleInvalidDeadline(event: FormEvent<HTMLInputElement>) {
    if (event.currentTarget.validity.rangeUnderflow) {
      event.preventDefault()
      onDeadlineBeforeMin()
    }
  }

  return (
    <FormSection number="04" title={t('referrals.form.appointment.title')} hint={t('referrals.form.appointment.hint')}>
      <div className="deadline-highlight">
        <FormField label={t('referrals.form.appointment.deadline')}>
          <TextInput
            required
            type="date"
            min={minDate}
            aria-invalid={deadlineInPast}
            value={resultDeadline}
            onValueChange={onResultDeadlineChange}
            onInvalid={handleInvalidDeadline}
          />
        </FormField>
        <CalendarDays aria-hidden="true" />
      </div>
      <FormField label={t('referrals.form.appointment.city')}>
        <TextInput required value={preferredCity} onValueChange={onPreferredCityChange} placeholder={t('referrals.form.appointment.cityPlaceholder')} />
      </FormField>
      <FormField label={t('referrals.form.appointment.notes')} optional>
        <TextArea value={notes} onValueChange={onNotesChange} placeholder={t('referrals.form.appointment.notesPlaceholder')} />
      </FormField>
    </FormSection>
  )
}
