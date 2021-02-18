import { h, JSX } from 'preact'
import { styled } from 'goober'

import ConfirmationModal from '~/modals/ConfirmDeleteNote'
import type { UseNotes, Note } from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

export interface NoteComponentProps {
  note: Note
  deleteNote: UseNotes['deleteNote']
}

export default function NoteComponent({
  note,
  deleteNote,
}: NoteComponentProps): JSX.Element | null {
  const modalRootId = 'CONFIRM_DELETE_NOTE_MODAL'
  const { id, content } = note

  const { open } = useModal({
    modalRootId,
    children: (
      <ConfirmationModal
        note={note}
        deleteNote={deleteNote}
        modalRootId={modalRootId}
      />
    ),
  })

  const limit = 150

  const text =
    content.length > limit
      ? `${content.substring(0, limit)}...`
      : content

  if (id) {
    return (
      <StyledNote key={id}>
        {/* TODO : a11y */}
        <CloseButton onClick={open} />
        <p>{text}</p>
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
