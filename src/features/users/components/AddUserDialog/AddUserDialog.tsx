import { useState, type FormEvent } from 'react'
import { INITIAL_PASSWORD } from '@/domain/catalogs'
import type { User } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { nextLogin, uid } from '@/lib/utils'
import { Button, TextInput } from '@/ui/atoms'
import { FormField } from '@/ui/molecules'
import { Modal } from '@/ui/organisms'

export interface AddUserDialogProps {
  users: User[]
  onClose: () => void
  onSave: (user: User) => Promise<void>
}

export function AddUserDialog({ users, onClose, onSave }: AddUserDialogProps) {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSave({
      id: uid(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: 'HR',
      login: nextLogin(firstName, lastName, users.map(user => user.login)),
      password: INITIAL_PASSWORD,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <Modal title={t('users.addDialog.title')} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <p className="form-intro">{t('users.addDialog.intro')}</p>
        <div className="form-grid two">
          <FormField label={t('users.addDialog.firstName')}>
            <TextInput autoFocus required value={firstName} onValueChange={setFirstName} />
          </FormField>
          <FormField label={t('users.addDialog.lastName')}>
            <TextInput required value={lastName} onValueChange={setLastName} />
          </FormField>
        </div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit">{t('users.addDialog.submit')}</Button>
        </div>
      </form>
    </Modal>
  )
}
