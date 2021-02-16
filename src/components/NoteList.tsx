import { h, Fragment, JSX } from 'preact'

import type { UseNotes, Note } from '~/hooks/useNotes'

export interface NoteListProps {
  data: UseNotes['data']
  loading: UseNotes['loading']
  error: UseNotes['error']
  deleteNote: UseNotes['deleteNote']
}

export default function NoteList({
  data,
  loading,
  error,
  deleteNote,
}: NoteListProps): JSX.Element {
  return (
    <Fragment>
      {!loading && !!data?.length ? (
        data.map((note: Note) => (
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
