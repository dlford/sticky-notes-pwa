import { h, JSX } from 'preact'
import { styled } from 'goober'

import useModal from '~/hooks/useModal'
import type { UseNotes } from '~/hooks/useNotes'

export interface AddNoteModalProps {
  createNote: UseNotes['createNote']
}

// TODO : Limit length, remove limit from Note component
// TODO : Close on click out of
// TODO : Close button

export default function AddNoteModal({
  createNote,
}: AddNoteModalProps): JSX.Element {
  const { close } = useModal({ modalRootId: 'ADD_NOTE_MODAL' })

  function handleAddNote(
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const content = formData.get('content') as string

    createNote({
      content,
    })

    event.currentTarget.reset()
    close()
  }

  return (
    <StyledForm action='post' onSubmit={handleAddNote}>
      <label htmlFor='content'>New Note</label>
      <textarea name='content' />
      <button className='primary' type='submit'>
        Add Note
      </button>
    </StyledForm>
  )
}

const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  background-color: var(--primary_200);
  padding: 2rem 3rem;
  border-radius: 1rem;
  textarea {
    width: 18rem;
    height: 14rem;
    max-width: 80vw;
    max-height: 80vh;
    background-color: var(--stickynote);
    font-family: 'Swanky and Moo Moo';
    font-size: var(--heading_2);
    padding: 0.5rem;
  }
  button {
    width: 8rem;
    margin: 1rem auto 0;
  }
`
