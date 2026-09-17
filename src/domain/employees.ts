import { z } from 'zod'
import type { TranslationKey } from '@/i18n/types'
import { documentTypes } from './catalogs'
import type { Employee } from './types'

const messages = {
  firstNameRequired: 'validation.employee.firstNameRequired',
  lastNameRequired: 'validation.employee.lastNameRequired',
  peselInvalid: 'validation.employee.peselInvalid',
  peselDuplicate: 'validation.employee.peselDuplicate',
  documentTypeRequired: 'validation.employee.documentTypeRequired',
  documentNumberRequired: 'validation.employee.documentNumberRequired',
  birthDateRequired: 'validation.employee.birthDateRequired',
  streetRequired: 'validation.employee.streetRequired',
  postalCodeRequired: 'validation.employee.postalCodeRequired',
  postalCodeFormat: 'validation.employee.postalCodeFormat',
  cityRequired: 'validation.employee.cityRequired',
  emailInvalid: 'validation.employee.emailInvalid',
  positionRequired: 'validation.employee.positionRequired',
} as const satisfies Record<string, TranslationKey>

function validPesel(value: string) {
  if (!/^\d{11}$/.test(value)) {
    return false
  }
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
  const checksum = weights.reduce((sum, weight, index) => sum + Number(value[index]) * weight, 0)
  return (10 - (checksum % 10)) % 10 === Number(value[10])
}

const employeeDraftSchema = z.object({
  firstName: z.string({ required_error: messages.firstNameRequired }).trim().min(1, messages.firstNameRequired),
  lastName: z.string({ required_error: messages.lastNameRequired }).trim().min(1, messages.lastNameRequired),
  hasPesel: z.boolean(),
  pesel: z.string().trim().optional(),
  documentType: z.enum(documentTypes).optional(),
  documentNumber: z.string().trim().optional(),
  birthDate: z.string().trim().optional(),
  address: z.object({
    street: z.string({ required_error: messages.streetRequired }).trim().min(1, messages.streetRequired),
    postalCode: z.string({ required_error: messages.postalCodeRequired }).trim().regex(/^\d{2}-\d{3}$/, messages.postalCodeFormat),
    city: z.string({ required_error: messages.cityRequired }).trim().min(1, messages.cityRequired),
  }),
  phone: z.string().trim().optional(),
  email: z.string().trim().email(messages.emailInvalid).optional().or(z.literal('')),
  position: z.string({ required_error: messages.positionRequired }).trim().min(1, messages.positionRequired),
}).superRefine((employee, context) => {
  if (employee.hasPesel) {
    if (!employee.pesel || !validPesel(employee.pesel)) {
      context.addIssue({ code: 'custom', path: ['pesel'], message: messages.peselInvalid })
    }
    return
  }
  if (!employee.documentType) {
    context.addIssue({ code: 'custom', path: ['documentType'], message: messages.documentTypeRequired })
  }
  if (!employee.documentNumber) {
    context.addIssue({ code: 'custom', path: ['documentNumber'], message: messages.documentNumberRequired })
  }
  if (!employee.birthDate || Number.isNaN(Date.parse(employee.birthDate))) {
    context.addIssue({ code: 'custom', path: ['birthDate'], message: messages.birthDateRequired })
  }
})

export type EmployeeDraft = z.input<typeof employeeDraftSchema>

export function prepareEmployee(value: EmployeeDraft, existing: readonly Employee[], currentId?: string) {
  const parsed = employeeDraftSchema.safeParse(value)
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.issues.map(issue => issue.message as TranslationKey) }
  }
  const employee = parsed.data
  const duplicate = employee.pesel && existing.some(item => item.id !== currentId && item.pesel === employee.pesel)
  if (duplicate) {
    return { ok: false as const, errors: [messages.peselDuplicate as TranslationKey] }
  }
  return { ok: true as const, value: employee }
}
