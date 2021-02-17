import { h, JSX } from 'preact'

import useModal from '~/hooks/useModal'
import type { UseNotes } from '~/hooks/useNotes'

export interface AddNoteModalProps {
  createNote: UseNotes['createNote']
}

// TODO : Limit length, remove limit from Note component

export default function AddNoteModal({
  createNote,
}: AddNoteModalProps): JSX.Element {
  const { close } = useModal({ modalRootId: 'ADD_NOTE_MODAL' })

  function handleAddNoteModal(
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
    <form action='post' onSubmit={handleAddNoteModal}>
      <label htmlFor='content'>Content</label>
      <input type='text' name='content' autoComplete='off' />
      <button className='primary' type='submit'>
        Add Note
      </button>
    </form>
  )
}
