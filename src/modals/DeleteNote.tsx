import { h, JSX } from 'preact'
import { styled } from 'goober'

import type { UseNotes, Note } from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

export interface DeleteNoteModalProps {
  note: Note
  deleteNote: UseNotes['deleteNote']
  modalRootId: string
}

export default function DeleteNoteModal({
  note,
  deleteNote,
  modalRootId,
}: DeleteNoteModalProps): JSX.Element {
  const { close } = useModal({ modalRootId })
  const { id, content } = note

  const limit = 150

  const text =
    content.length > limit
      ? `${content.substring(0, limit)}...`
      : content

  async function handleYes() {
    if (id) {
      await deleteNote({ id })
    }
    close()
  }

  return (
    <StyledModal>
      <h1 className='h3'>Delete Note</h1>
      <div className='note'>{text}</div>
      <div className='buttons'>
        <button className='bad' onClick={handleYes}>
          Delete
        </button>
        <button onClick={close}>Keep</button>
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
    font-family: var(--swanky_and_moo_moo);
    font-size: var(--heading_2);
    padding: 0.5rem;
  }
  h1 {
    text-align: center;
    margin: 0;
  }
  .buttons {
    display: flex;
    gap: 1rem;
    margin: 0 auto;
    button {
      width: 8rem;
    }
  }
`
