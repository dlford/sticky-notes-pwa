import { h, JSX } from 'preact'
import { styled } from 'goober'

import type {
  UseNotes,
  Note,
  DeleteNoteInput,
} from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

export interface ConfirmDeleteNoteModalProps {
  note: Note
  deleteNote: UseNotes['deleteNote']
  modalRootId: string
}

export default function ConfirmDeleteNoteModal({
  note,
  deleteNote,
  modalRootId,
}: ConfirmDeleteNoteModalProps): JSX.Element {
  const { close } = useModal({ modalRootId })
  const { id, content } = note

  const limit = 150

  const text =
    content.length > limit
      ? `${content.substring(0, limit)}...`
      : content

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
      <div className='note'>{text}</div>
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
  .note {
    color: var(--black);
    margin: 0 auto;
    width: 18rem;
    height: 14rem;
    background-color: var(--stickynote);
    font-family: 'Swanky and Moo Moo';
    font-size: var(--heading_2);
    padding: 0.5rem;
  }
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
