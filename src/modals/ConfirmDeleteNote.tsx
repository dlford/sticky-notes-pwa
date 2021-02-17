import { h, JSX, Fragment } from 'preact'

import type {
  UseNotes,
  Note,
  DeleteNoteInput,
} from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

export interface ConfirmDeleteNoteModalProps {
  id?: Note['id']
  deleteNote: UseNotes['deleteNote']
  modalRootId: string
}

export default function ConfirmDeleteNoteModal({
  id,
  deleteNote,
  modalRootId,
}: ConfirmDeleteNoteModalProps): JSX.Element {
  const { close } = useModal({ modalRootId })

  async function handleYes() {
    if (id) {
      await deleteNote({ id } as DeleteNoteInput)
    }
    close()
  }

  return (
    <Fragment>
      <h3>Are you sure?</h3>
      <button onClick={handleYes}>Yes</button>
      <button onClick={close}>No</button>
    </Fragment>
  )
}
