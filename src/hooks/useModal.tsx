import { render, JSX } from 'preact'
import { useState } from 'preact/hooks'

export interface UseModalProps {
  appRootId?: string
  modalRootId?: string
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
  children,
}: UseModalProps): UseModal {
  const [isOpen, setIsOpen] = useState(false)

  const appRoot = document.getElementById(appRootId)
  if (!appRoot) {
    throw new Error('Inavlid appRootId supplied to useModal')
  }

  // This should match the .modal CSS class
  const animationDuration = 200

  let modalRoot = document.getElementById(modalRootId)
  if (!modalRoot) {
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('aria-hidden', 'true')
    modalRoot.setAttribute('inert', 'true')
    modalRoot.setAttribute('aria-modal', 'true')
    modalRoot.id = modalRootId
    modalRoot.classList.add('modal')
    document.body.appendChild(modalRoot)
  }

  function handleEscapeKeyPress(event: KeyboardEvent) {
    const { key } = event
    if (key === 'Escape') {
      close()
    }
  }

  function handleClickOutside(event: MouseEvent | TouchEvent) {
    if (event.target instanceof HTMLElement) {
      if (event.target.contains(modalRoot)) {
        close()
      }
    }
  }

  function open() {
    if (modalRoot && appRoot) {
      if (children) {
        render(children, modalRoot)
      }
      appRoot.setAttribute('aria-hidden', 'true')
      appRoot.setAttribute('inert', 'true')
      modalRoot.removeAttribute('aria-hidden')
      modalRoot.removeAttribute('inert')
      window.addEventListener('keydown', handleEscapeKeyPress)
      window.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('touchstart', handleClickOutside)
      setIsOpen(true)
      modalRoot.classList.add('active')
    }
  }

  function close() {
    if (modalRoot && appRoot) {
      modalRoot.classList.remove('active')
      setTimeout(() => {
        if (modalRoot) {
          appRoot.removeAttribute('aria-hidden')
          appRoot.removeAttribute('inert')
          modalRoot.setAttribute('aria-hidden', 'true')
          modalRoot.setAttribute('inert', 'true')
          window.removeEventListener('keydown', handleEscapeKeyPress)
          window.removeEventListener('mousedown', handleClickOutside)
          window.removeEventListener('touchstart', handleClickOutside)
          setIsOpen(false)
          render('', modalRoot)
        }
      }, animationDuration)
    }
  }

  return {
    isOpen,
    open,
    close,
  }
}
