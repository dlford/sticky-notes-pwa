import { h, JSX } from 'preact'
import { useContext } from 'preact/hooks'

import NotesContext from '~/context/Notes'
import useModal from '~/hooks/useModal'

export default function AddNote(): JSX.Element {
  const { createNote } = useContext(NotesContext)
  const { close } = useModal({ modalRootId: 'ADD_NOTE_MODAL' })

  function handleAddNote(
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    createNote({
      title,
      content,
    })

    event.currentTarget.reset()
    close()
  }

  return (
    <form action='post' onSubmit={handleAddNote}>
      <label htmlFor='title'>Title</label>
      <input type='text' name='title' autoComplete='off' />
      <label htmlFor='content'>Content</label>
      <input type='text' name='content' autoComplete='off' />
      <button className='primary' type='submit'>
        Add Note
      </button>
    </form>
  )
}
