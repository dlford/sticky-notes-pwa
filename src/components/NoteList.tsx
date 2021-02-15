import { h, Fragment, JSX } from 'preact'

import useNotes from '~/context/Notes'

export default function NoteList(): JSX.Element {
  const { data, loading, error, deleteNote } = useNotes()

  return (
    <Fragment>
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
    </Fragment>
  )
}
