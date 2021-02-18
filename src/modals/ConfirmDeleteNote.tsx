import { h, JSX } from 'preact'
import { styled } from 'goober'

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
    <StyledModal>
      <h1 className='h4'>
        Are you sure you want to delete this note?
      </h1>
      <div className='buttons'>
        <button className='bad' onClick={handleYes}>
          Yes
        </button>
        <button onClick={close}>No</button>
      </div>
    </StyledModal>
  )
}

const StyledModal = styled('div')`
  display: flex;
  flex-direction: column;
  background-color: var(--primary_200);
  padding: 2rem;
  border-radius: 1rem;
  gap: 2rem;
  h1 {
    margin: 0;
  }
  .buttons {
    display: flex;
    gap: 1rem;
    margin: 0 auto;
    button {
      width: 5rem;
    }
  }
`
