import { h, JSX } from 'preact'
import { styled } from 'goober'

import type { UseNotes, Note } from '~/hooks/useNotes'
import NoteComponent from '~/components/Note'

export interface NoteListComponentProps {
  data: UseNotes['data']
  loading: UseNotes['loading']
  error: UseNotes['error']
  updateNote: UseNotes['updateNote']
  deleteNote: UseNotes['deleteNote']
}

export default function NoteListComponent({
  data,
  loading,
  error,
  updateNote,
  deleteNote,
}: NoteListComponentProps): JSX.Element | null {
  if (loading) return null

  return (
    <StyledNoteList>
      {data?.length ? (
        data.map((note: Note) => (
          <NoteComponent
            note={note}
            deleteNote={deleteNote}
            updateNote={updateNote}
          />
        ))
      ) : (
        <p>
          No notes found, click the Add Note button to get started!
        </p>
      )}
      {loading && <p>Loading...</p>}
      {!!error?.length && <p>{JSON.stringify(error)}</p>}
    </StyledNoteList>
  )
}

const StyledNoteList = styled('div')`
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`
