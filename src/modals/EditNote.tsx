import { h, JSX } from 'preact'
import { styled } from 'goober'

import type { UseNotes, Note } from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

export interface EditNoteModalProps {
  note: Note
  updateNote: UseNotes['updateNote']
  modalRootId: string
}

export default function EditNoteModal({
  note,
  updateNote,
  modalRootId,
}: EditNoteModalProps): JSX.Element {
  const { id, content, createdAt } = note

  const { close } = useModal({ modalRootId })

  async function handleSave(
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const newContent = formData.get('content') as string

    await updateNote({ id, content: newContent, createdAt })
    close()
  }

  return (
    <StyledForm method='post' onSubmit={handleSave}>
      <h1 className='h3'>Edit Note</h1>
      <label htmlFor='content'>Note</label>
      <textarea name='content' value={content} />
      <div className='buttons'>
        <button type='submit' className='primary'>
          Save
        </button>
        <button type='button' className='bad' onClick={close}>
          Cancel
        </button>
      </div>
    </StyledForm>
  )
}

const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  background-color: var(--primary_200);
  padding: 2rem 3rem;
  border-radius: 1rem;
  h1 {
    text-align: center;
  }
  textarea {
    color: var(--black);
    width: 18rem;
    height: 14rem;
    max-width: 80vw;
    max-height: 80vh;
    background-color: var(--stickynote);
    font-family: 'Swanky and Moo Moo';
    font-size: var(--heading_2);
    padding: 0.5rem;
    margin-bottom: 2rem;
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
