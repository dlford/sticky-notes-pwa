import { render, JSX } from 'preact'
import { useState } from 'preact/hooks'

export interface UseModalProps {
  appRootId?: string
  modalRootId?: string
  onClose?(): unknown
  children?: JSX.Element
}

export interface UseModal {
  isOpen: boolean
  open(): void
  close(): void
}

export default function useModal({
  appRootId = 'root',
  modalRootId = 'modal',
  onClose,
  children,
}: UseModalProps): UseModal {
  const [isOpen, setIsOpen] = useState(false)

  const appRoot = document.getElementById(appRootId)
  if (!appRoot) {
    throw new Error('Inavlid appRootId supplied to useModal')
  }

  let modalRoot = document.getElementById(modalRootId)
  if (!modalRoot) {
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('aria-hidden', 'true')
    modalRoot.setAttribute('inert', 'true')
    modalRoot.setAttribute('aria-modal', 'true')
    modalRoot.id = modalRootId
    modalRoot.style.display = 'none'
    modalRoot.style.alignItems = 'center'
    modalRoot.style.justifyContent = 'center'
    modalRoot.style.position = 'absolute'
    modalRoot.style.top = '0'
    modalRoot.style.left = '0'
    modalRoot.style.width = '100vw'
    modalRoot.style.height = '100vh'
    modalRoot.style.zIndex = '9'
    modalRoot.style.backgroundColor = 'rgba(0,0,0,45%)'
    document.body.appendChild(modalRoot)
  }

  function open() {
    if (modalRoot && appRoot) {
      appRoot.setAttribute('aria-hidden', 'true')
      appRoot.setAttribute('inert', 'true')
      modalRoot.removeAttribute('aria-hidden')
      modalRoot.removeAttribute('inert')
      modalRoot.style.display = 'flex'
      window.addEventListener('keydown', handleEscapeKeyPress)
      setIsOpen(true)
    }
  }

  function close() {
    if (modalRoot && appRoot) {
      appRoot.removeAttribute('aria-hidden')
      appRoot.removeAttribute('inert')
      modalRoot.setAttribute('aria-hidden', 'true')
      modalRoot.setAttribute('inert', 'true')
      modalRoot.style.display = 'none'
      window.removeEventListener('keydown', handleEscapeKeyPress)
      setIsOpen(false)
      !!onClose && onClose()
    }
  }

  if (modalRoot && children) {
    render(children, modalRoot)
  }

  function handleEscapeKeyPress(event: KeyboardEvent) {
    const { key } = event
    if (key === 'Escape') {
      close()
    }
  }

  return {
    isOpen,
    open,
    close,
  }
}
