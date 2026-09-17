import type { Employee } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { Avatar, Select, TextInput } from '@/ui/atoms'
import { FormField } from '@/ui/molecules'
import { FormSection } from '@/ui/organisms'

export interface EmployeeSectionProps {
  employees: Employee[]
  selectedEmployee?: Employee
  employeeId: string
  position: string
  onEmployeeChange: (employeeId: string) => void
  onPositionChange: (position: string) => void
}

export function EmployeeSection({
  employees,
  selectedEmployee,
  employeeId,
  position,
  onEmployeeChange,
  onPositionChange,
}: EmployeeSectionProps) {
  const { t } = useTranslation()
  const employeeOptions = employees.map(employee => ({
    value: employee.id,
    label: t('referrals.form.employee.option', { name: `${employee.firstName} ${employee.lastName}`, position: employee.position }),
  }))

  return (
    <FormSection number="02" title={t('referrals.form.employee.title')} hint={t('referrals.form.employee.hint')}>
      <FormField label={t('referrals.form.employee.select')}>
        <Select
          required
          placeholder={t('referrals.form.employee.selectPlaceholder')}
          options={employeeOptions}
          value={employeeId}
          onValueChange={onEmployeeChange}
        />
      </FormField>
      {selectedEmployee && (
        <div className="employee-summary">
          <Avatar firstName={selectedEmployee.firstName} lastName={selectedEmployee.lastName} size="lg" />
          <div>
            <strong>{selectedEmployee.firstName} {selectedEmployee.lastName}</strong>
            <p>
              {selectedEmployee.hasPesel
                ? t('referrals.form.employee.pesel', { pesel: selectedEmployee.pesel ?? '' })
                : t('referrals.form.employee.document', { documentNumber: selectedEmployee.documentNumber ?? '' })}
              {' · '}{selectedEmployee.address.city}
            </p>
          </div>
        </div>
      )}
      <FormField label={t('referrals.form.employee.position')}>
        <TextInput required value={position} onValueChange={onPositionChange} />
      </FormField>
    </FormSection>
  )
}
