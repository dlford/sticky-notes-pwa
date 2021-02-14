import { h, JSX } from 'preact'
import { styled } from 'goober'

import AddNote from '~/components/AddNote'
import useNotes from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

function App(): JSX.Element {
  const {
    loading,
    data,
    error,
    createNote,
    deleteNote,
    refetch,
  } = useNotes()
  const { isOpen, open } = useModal({
    onClose: refetch,
    modalRootId: 'ADD_NOTE_MODAL',
    children: <AddNote />,
  })

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
  }

  return (
    <StyledPage className='App'>
      <h1>Sticky Notes</h1>
      <h2>{isOpen}</h2>
      <button onClick={open}>Open Modal</button>
      <button onClick={close}>Close Modal</button>
      <form action='post' onSubmit={handleAddNote}>
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' autoComplete='off' />
        <label htmlFor='content'>Content</label>
        <input type='text' name='content' autoComplete='off' />
        <button className='primary' type='submit'>
          Add Note
        </button>
      </form>
      {!loading && !!data?.length ? (
        data.map((note) => (
          <div key={note.id}>
            <h5>{note.title}</h5>
            <p>{note.content}</p>
            <button
              className='bad'
              onClick={() => deleteNote({ id: note.id as number })}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No notes found...</p>
      )}
      {loading && <p>Loading...</p>}
      {!!error?.length && <p>{JSON.stringify(error)}</p>}
    </StyledPage>
  )
}

export default App

const StyledPage = styled('main')`
  width: 60rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
`
