import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isReferralDeadlineInPast, localDateIso } from '@/domain/referralDeadline'
import type { Employee, ExamType } from '@/domain/types'
import { useGetEmployees, useGetExposureFactors, useGetReferralTemplates } from '@/core/queries'
import { Button } from '@/ui/atoms'
import { Toast } from '@/ui/molecules'
import { PageHeader } from '@/ui/organisms'
import { AppointmentSection } from '@/features/referrals/components/AppointmentSection'
import { EmployeeSection } from '@/features/referrals/components/EmployeeSection'
import { ExamTypeSection } from '@/features/referrals/components/ExamTypeSection'
import { ExposureFactorsSection } from '@/features/referrals/components/ExposureFactorsSection'
import { ReferralSummary } from '@/features/referrals/components/ReferralSummary'
import { ReferralIssuanceError } from '@/features/referrals/issuance/ReferralIssuance'
import { useReferralIssuance } from '@/features/referrals/issuance/useReferralIssuance'
import { useTranslation, type TranslationKey } from '@/i18n'

export default function NewReferralPage() {
  const { t } = useTranslation()
  const employees = useGetEmployees()
  const factors = useGetExposureFactors()
  const templates = useGetReferralTemplates()
  const issueReferral = useReferralIssuance()
  const navigate = useNavigate()
  const params = new URLSearchParams(useLocation().search)
  const [examType, setExamType] = useState<ExamType>('INITIAL')
  const [employeeId, setEmployeeId] = useState(params.get('employeeId') || '')
  const [position, setPosition] = useState('')
  const [factorIds, setFactorIds] = useState<string[]>([])
  const [workConditions, setWorkConditions] = useState('')
  const [resultDeadline, setResultDeadline] = useState('')
  const [preferredCity, setPreferredCity] = useState('')
  const [notes, setNotes] = useState('')
  const [errorKey, setErrorKey] = useState<TranslationKey>()
  const [deadlineToast, setDeadlineToast] = useState(false)
  const selectedEmployee = employees.data?.find(employee => employee.id === employeeId)

  const prefilledFromUrl = useRef(false)

  function prefillFromEmployee(employee?: Employee) {
    if (employee) {
      setPosition(employee.position)
      setPreferredCity(employee.address.city)
    }
  }

  function selectEmployee(id: string) {
    setEmployeeId(id)
    prefillFromEmployee(employees.data?.find(employee => employee.id === id))
  }

  // Prefill once for ?employeeId=…; background refetches must not overwrite user edits.
  useEffect(() => {
    if (prefilledFromUrl.current || !selectedEmployee) {
      return
    }
    prefilledFromUrl.current = true
    prefillFromEmployee(selectedEmployee)
  }, [selectedEmployee])

  function changeResultDeadline(value: string) {
    setResultDeadline(value)
    setDeadlineToast(false)
  }

  function toggleFactor(id: string) {
    setFactorIds(currentIds => (
      currentIds.includes(id)
        ? currentIds.filter(currentId => currentId !== id)
        : [...currentIds, id]
    ))
  }

  function applyTemplate(templateId: string) {
    const template = templates.data?.find(item => item.id === templateId)
    if (template) {
      setFactorIds(template.factorIds.filter(id => factors.data?.some(factor => factor.id === id)))
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorKey(undefined)

    if (isReferralDeadlineInPast(resultDeadline)) {
      setDeadlineToast(true)
      return
    }

    try {
      const referral = await issueReferral.mutateAsync({
        employeeId,
        examType,
        position,
        factorIds,
        workConditions,
        resultDeadline,
        preferredCity,
        notes,
      })
      navigate('/skierowania', { state: { previewId: referral.id } })
    } catch (caught) {
      setErrorKey(caught instanceof ReferralIssuanceError ? caught.messageKey : 'validation.referral.unexpected')
    }
  }

  return (
    <>
      <Button variant="plain" className="back-link" onClick={() => navigate('/skierowania')}>
        <ArrowLeft aria-hidden="true" />
        {t('referrals.form.back')}
      </Button>
      <PageHeader
        eyebrow={t('referrals.form.eyebrow')}
        title={t('referrals.form.title')}
        description={t('referrals.form.description')}
      />
      <form onSubmit={submit} className="referral-layout">
        <div className="referral-main">
          <ExamTypeSection examType={examType} onChange={setExamType} />
          <EmployeeSection
            employees={employees.data || []}
            selectedEmployee={selectedEmployee}
            employeeId={employeeId}
            position={position}
            onEmployeeChange={selectEmployee}
            onPositionChange={setPosition}
          />
          <ExposureFactorsSection
            factors={factors.data || []}
            templates={templates.data || []}
            selectedIds={factorIds}
            workConditions={workConditions}
            onTemplateChange={applyTemplate}
            onFactorToggle={toggleFactor}
            onWorkConditionsChange={setWorkConditions}
          />
          <AppointmentSection
            minDate={localDateIso()}
            deadlineInPast={isReferralDeadlineInPast(resultDeadline)}
            onDeadlineBeforeMin={() => setDeadlineToast(true)}
            resultDeadline={resultDeadline}
            preferredCity={preferredCity}
            notes={notes}
            onResultDeadlineChange={changeResultDeadline}
            onPreferredCityChange={setPreferredCity}
            onNotesChange={setNotes}
          />
        </div>
        <ReferralSummary
          examType={examType}
          employee={selectedEmployee}
          factorCount={factorIds.length}
          resultDeadline={resultDeadline}
          error={errorKey && t(errorKey)}
          submitting={issueReferral.isPending}
        />
      </form>
      {deadlineToast && (
        <Toast
          variant="error"
          message={t('referrals.form.appointment.deadlineInPast')}
          onDone={() => setDeadlineToast(false)}
        />
      )}
    </>
  )
}
