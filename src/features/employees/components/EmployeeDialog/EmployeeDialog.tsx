import { useState, type FormEvent } from 'react'
import type { Employee } from '@/domain/types'
import { prepareEmployee, type EmployeeDraft } from '@/domain/employees'
import { documentTypes } from '@/domain/catalogs'
import { useTranslation, type TranslationKey } from '@/i18n'
import { uid } from '@/lib/utils'
import { Button, FieldError, Select, Switch, TextInput } from '@/ui/atoms'
import { FormField } from '@/ui/molecules'
import { Modal } from '@/ui/organisms'

type DocumentType = NonNullable<Employee['documentType']>

const emptyEmployee: EmployeeDraft = {
  firstName: '',
  lastName: '',
  hasPesel: true,
  pesel: '',
  address: { street: '', postalCode: '', city: '' },
  phone: '',
  email: '',
  position: '',
}

export interface EmployeeDialogProps {
  employee: Employee | null
  employees: Employee[]
  onClose: () => void
  onSave: (employee: Employee) => Promise<void>
}

export function EmployeeDialog({ employee, employees, onClose, onSave }: EmployeeDialogProps) {
  const { t } = useTranslation()
  const [data, setData] = useState<EmployeeDraft>(employee || emptyEmployee)
  const [saving, setSaving] = useState(false)
  const [errorKey, setErrorKey] = useState<TranslationKey>()
  const documentTypeOptions = documentTypes.map(type => ({ value: type, label: t(`domain.documentTypes.${type}`) }))

  function updateField(key: 'firstName' | 'lastName' | 'pesel' | 'documentNumber' | 'birthDate' | 'phone' | 'email' | 'position') {
    return (value: string) => {
      setData(current => ({ ...current, [key]: value }))
    }
  }

  function updateAddress(key: keyof Employee['address']) {
    return (value: string) => {
      setData(current => ({ ...current, address: { ...current.address, [key]: value } }))
    }
  }

  function togglePesel(hasPesel: boolean) {
    setData(current => ({
      ...current,
      hasPesel,
      pesel: '',
      documentType: undefined,
      documentNumber: '',
      birthDate: '',
    }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const prepared = prepareEmployee(data, employees, employee?.id)
    if (!prepared.ok) {
      setErrorKey(prepared.errors[0])
      return
    }
    setSaving(true)
    try {
      await onSave({ id: employee?.id || uid(), ...prepared.value })
    } finally {
      setSaving(false)
    }
  }

  const identityFields = data.hasPesel ? (
    <FormField label={t('employees.dialog.pesel')}>
      <TextInput required inputMode="numeric" value={data.pesel || ''} onValueChange={updateField('pesel')} />
    </FormField>
  ) : (
    <div className="form-grid three">
      <FormField label={t('employees.dialog.documentType')}>
        <Select
          required
          placeholder={t('employees.dialog.documentTypePlaceholder')}
          options={documentTypeOptions}
          value={data.documentType || ''}
          onValueChange={value => setData(current => ({ ...current, documentType: (value || undefined) as DocumentType | undefined }))}
        />
      </FormField>
      <FormField label={t('employees.dialog.documentNumber')}>
        <TextInput required value={data.documentNumber || ''} onValueChange={updateField('documentNumber')} />
      </FormField>
      <FormField label={t('employees.dialog.birthDate')}>
        <TextInput required type="date" value={data.birthDate || ''} onValueChange={updateField('birthDate')} />
      </FormField>
    </div>
  )

  return (
    <Modal title={t(employee ? 'employees.dialog.editTitle' : 'employees.dialog.createTitle')} onClose={onClose}>
      <form onSubmit={submit} className="form">
        <div className="form-grid two">
          <FormField label={t('employees.dialog.firstName')}>
            <TextInput autoFocus required value={data.firstName} onValueChange={updateField('firstName')} />
          </FormField>
          <FormField label={t('employees.dialog.lastName')}>
            <TextInput required value={data.lastName} onValueChange={updateField('lastName')} />
          </FormField>
        </div>
        <Switch label={t('employees.dialog.hasPesel')} checked={data.hasPesel} onCheckedChange={togglePesel} />
        {identityFields}
        <div className="section-label">{t('employees.dialog.address')}</div>
        <FormField label={t('employees.dialog.street')}>
          <TextInput required value={data.address.street} onValueChange={updateAddress('street')} />
        </FormField>
        <div className="form-grid two narrow-first">
          <FormField label={t('employees.dialog.postalCode')}>
            <TextInput required value={data.address.postalCode} onValueChange={updateAddress('postalCode')} />
          </FormField>
          <FormField label={t('employees.dialog.city')}>
            <TextInput required value={data.address.city} onValueChange={updateAddress('city')} />
          </FormField>
        </div>
        <div className="form-grid two">
          <FormField label={t('employees.dialog.phone')} optional>
            <TextInput value={data.phone || ''} onValueChange={updateField('phone')} />
          </FormField>
          <FormField label={t('employees.dialog.email')} optional>
            <TextInput type="email" value={data.email || ''} onValueChange={updateField('email')} />
          </FormField>
        </div>
        <FormField label={t('employees.dialog.position')}>
          <TextInput required value={data.position} onValueChange={updateField('position')} />
        </FormField>
        <FieldError message={errorKey && t(errorKey)} />
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" disabled={saving}>{t(saving ? 'employees.dialog.submitting' : 'employees.dialog.submit')}</Button>
        </div>
      </form>
    </Modal>
  )
}
