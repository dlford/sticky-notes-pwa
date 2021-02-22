import { h, JSX } from 'preact'
import { styled } from 'goober'

import DeleteButton from '~/components/DeleteButton'
import EditModal from '~/modals/EditNote'
import type { UseNotes, Note } from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

export interface NoteComponentProps {
  note: Note
  deleteNote: UseNotes['deleteNote']
  updateNote: UseNotes['updateNote']
}

export default function NoteComponent({
  note,
  updateNote,
  deleteNote,
}: NoteComponentProps): JSX.Element | null {
  const modalRootId = 'EDIT_NOTE_MODAL'

  const { open: openEdit } = useModal({
    modalRootId,
    children: (
      <EditModal
        note={note}
        updateNote={updateNote}
        modalRootId={modalRootId}
      />
    ),
  })

  const { id, content } = note

  const limit = 150

  const text =
    content.length > limit
      ? `${content.substring(0, limit)}...`
      : content

  if (id) {
    return (
      <StyledNote key={id}>
        <DeleteButton note={note} deleteNote={deleteNote} />
        <div
          className='click-target'
          onClick={openEdit}
          tabIndex={0}
          aria-role='button'
          aria-label='Edit Note'
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              openEdit()
            }
          }}
        >
          <p>{text}</p>
        </div>
      </StyledNote>
    )
  }

  return null
}

const StyledNote = styled('div')`
  position: relative;
  padding-top: 0.5rem;
  width: 18rem;
  height: 14rem;
  background-color: var(--stickynote);
  color: var(--black);
  .click-target {
    cursor: pointer;
    height: calc(100% - 1rem);
  }
  p {
    margin: 1rem;
    font-family: var(--swanky_and_moo_moo);
    font-size: var(--heading_2);
  }
`
