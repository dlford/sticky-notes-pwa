import { h, JSX } from 'preact'
import { styled } from 'goober'

import useModal from '~/hooks/useModal'
import type { UseNotes } from '~/hooks/useNotes'

export interface AddNoteModalProps {
  createNote: UseNotes['createNote']
}

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
      <h1 className='h3'>Add Note</h1>
      <label htmlFor='content'>New Note</label>
      <textarea name='content' />
      <div className='buttons'>
        <button className='primary' type='submit'>
          Save
        </button>
        <button type='reset' onClick={close} className='bad'>
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
