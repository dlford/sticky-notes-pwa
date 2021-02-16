import { h, JSX } from 'preact'
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
    <StyleNoteList>
      {!loading && !!data?.length ? (
        data.map((note: Note) => {
          const { content } = note
          const limit = 155

          const text =
            content.length > limit
              ? `${content.substring(0, limit)}...`
              : content

          return (
            <StyledNote key={note.id}>
              {/* TODO : a11y */}
              <CloseButton
                onClick={() => deleteNote({ id: note.id as number })}
              />
              <p>{text}</p>
            </StyledNote>
          )
        })
      ) : (
        <p>No notes found...</p>
      )}
      {loading && <p>Loading...</p>}
      {!!error?.length && <p>{JSON.stringify(error)}</p>}
    </StyleNoteList>
  )
}

const StyleNoteList = styled('div')`
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`

const StyledNote = styled('div')`
  position: relative;
  padding-top: 0.5rem;
  width: 18rem;
  height: 14rem;
  background-color: var(--stickynote);
  color: var(--black);
  p {
    margin: 1rem;
    font-family: 'Swanky and Moo Moo';
    font-size: var(--heading_2);
  }
`

const CloseButton = styled('div')`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border: 7px solid #f56b00;
  background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) 43%,
      #fff 45%,
      #fff 55%,
      rgba(0, 0, 0, 0) 57%,
      rgba(0, 0, 0, 0) 100%
    ),
    linear-gradient(
      135deg,
      #f56b00 0%,
      #f56b00 43%,
      #fff 45%,
      #fff 55%,
      #f56b00 57%,
      #f56b00 100%
    );
`
