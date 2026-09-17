import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { IconButton } from '@/ui/atoms'

export interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}

export function Modal({ title, children, onClose, wide = false }: ModalProps) {
  const { t } = useTranslation()
  const titleId = useId()
  const modalRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const modal = modalRef.current
    function focusable() {
      return Array.from(
        modal?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') || [],
      )
    }
    const preferred = modal?.querySelector<HTMLElement>('[autofocus]')
    ;(preferred || focusable()[0] || modal)?.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const items = focusable()
      if (!items.length) {
        event.preventDefault()
        return
      }
      const [first] = items
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    addEventListener('keydown', handleKey)
    return () => {
      removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [])

  return (
    <div className="modal-layer">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label={t('common.closeDialog')} />
      <div
        ref={modalRef}
        className={wide ? 'modal wide' : 'modal'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-head">
          <h2 id={titleId}>{title}</h2>
          <IconButton className="icon-button" icon={X} label={t('common.closeDialog')} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  )
}
