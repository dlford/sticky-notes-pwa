import { h, JSX, Fragment } from 'preact'

import useModal, { UseModal } from '~/hooks/useModal'

export interface UseConfirmationModalProps<T, U> {
  payload: T
  action(arg0: T): U
  modalRootId: string
}

export default function useConfirmationModal({
  payload,
  action,
  modalRootId,
}: UseConfirmationModalProps<unknown, unknown>): UseModal {
  const { isOpen, open, close } = useModal({
    modalRootId,
    children: (
      <ConfirmationModal
        action={action}
        payload={payload}
        modalRootId={modalRootId}
      />
    ),
  })

  return {
    isOpen,
    open,
    close,
  }
}

function ConfirmationModal({
  action,
  payload,
  modalRootId,
}: UseConfirmationModalProps<unknown, unknown>): JSX.Element {
  const { close } = useModal({ modalRootId })

  function handleYes() {
    action(payload)
    close()
  }

  return (
    <Fragment>
      <button onClick={handleYes}>Yes</button>
      <button onClick={close}>No</button>
    </Fragment>
  )
}
