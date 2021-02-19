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

  const animationDuration = 200

  let modalRoot = document.getElementById(modalRootId)
  if (!modalRoot) {
    modalRoot = document.createElement('div')
    // TODO : Move styles to css className
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
    modalRoot.style.opacity = '0'
    modalRoot.style.transition = `opacity ease-in-out ${animationDuration}ms`
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
      modalRoot.style.display = 'flex'
      window.addEventListener('keydown', handleEscapeKeyPress)
      window.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('touchstart', handleClickOutside)
      setIsOpen(true)
      setTimeout(() => {
        if (modalRoot?.style?.opacity) {
          modalRoot.style.opacity = '1'
        }
      }, 1)
    }
  }

  function close() {
    if (modalRoot && appRoot) {
      modalRoot.style.opacity = '0'
      setTimeout(() => {
        if (modalRoot) {
          appRoot.removeAttribute('aria-hidden')
          appRoot.removeAttribute('inert')
          modalRoot.setAttribute('aria-hidden', 'true')
          modalRoot.setAttribute('inert', 'true')
          modalRoot.style.display = 'none'
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
