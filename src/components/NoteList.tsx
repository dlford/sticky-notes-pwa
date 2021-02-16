import { h, Fragment, JSX } from 'preact'
import { styled } from 'goober'

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
          <StyledNote key={note.id}>
            <p>{note.content}</p>
            <button
              className='bad'
              onClick={() => deleteNote({ id: note.id as number })}
            >
              Delete
            </button>
          </StyledNote>
        ))
      ) : (
        <p>No notes found...</p>
      )}
      {loading && <p>Loading...</p>}
      {!!error?.length && <p>{JSON.stringify(error)}</p>}
    </Fragment>
  )
}

const StyledNote = styled('div')`
  background-color: var(--stickynote);
  color: var(--black);
  p {
    margin: 1rem;
    font-family: 'Swanky and Moo Moo';
    font-size: var(--heading_2);
    font-weight: bold;
  }
`
