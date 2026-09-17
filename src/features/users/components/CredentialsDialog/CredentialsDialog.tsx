import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { User } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { Button } from '@/ui/atoms'
import { Modal } from '@/ui/organisms'

export interface CredentialsDialogProps {
  user: User
  onClose: () => void
}

export function CredentialsDialog({ user, onClose }: CredentialsDialogProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  async function copyCredentials() {
    await navigator.clipboard.writeText(t('users.credentials.clipboard', { login: user.login, password: user.password }))
    setCopied(true)
  }

  return (
    <Modal title={t('users.credentials.title')} onClose={onClose}>
      <div className="credentials-dialog">
        <div className="success-panel">
          <span aria-hidden="true"><Check /></span>
          <h3>{t('users.credentials.heading', { name: `${user.firstName} ${user.lastName}` })}</h3>
          <p>{t('users.credentials.description')}</p>
        </div>
        <div className="credentials" aria-label={t('users.credentials.label')}>
          <div>
            <small>{t('users.credentials.login')}</small>
            <strong>{user.login}</strong>
          </div>
          <div>
            <small>{t('users.credentials.password')}</small>
            <strong>{user.password}</strong>
          </div>
          <Button
            variant="ghost"
            className="credentials-copy"
            onClick={() => void copyCredentials()}
            aria-live="polite"
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {t(copied ? 'users.credentials.copied' : 'users.credentials.copy')}
          </Button>
        </div>
        <div className="modal-actions">
          <Button onClick={onClose}>{t('users.credentials.done')}</Button>
        </div>
      </div>
    </Modal>
  )
}
