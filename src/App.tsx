import { h, JSX } from 'preact'
import useNotes from '~/hooks/useNotes'

function App(): JSX.Element {
  const { loading, data, error, createNote, deleteNote } = useNotes()

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
    <div className='App'>
      {loading && <p>Loading...</p>}
      <form action='post' onSubmit={handleAddNote}>
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' />
        <label htmlFor='content'>Content</label>
        <input type='text' name='content' />
        <button type='submit'>Add Note</button>
      </form>
      {!loading && !!data?.length ? (
        data.map((note) => (
          <div key={note.id}>
            <h5>{note.title}</h5>
            <p>{note.content}</p>
            <button
              onClick={() => deleteNote({ id: note.id as string })}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No notes found...</p>
      )}
      {!!error?.length && <p>{JSON.stringify(error)}</p>}
    </div>
  )
}

export default App
