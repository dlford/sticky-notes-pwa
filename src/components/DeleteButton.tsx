import { h, JSX } from 'preact'
import { styled } from 'goober'

import DeleteModal from '~/modals/DeleteNote'
import type { UseNotes, Note } from '~/hooks/useNotes'
import useModal from '~/hooks/useModal'

export interface DeleteButtonProps {
  note: Note
  deleteNote: UseNotes['deleteNote']
}

export default function DeleteButtonComponent({
  note,
  deleteNote,
}: DeleteButtonProps): JSX.Element {
  const modalRootId = 'DELETE_NOTE_MODAL'
  const { open: openDelete } = useModal({
    modalRootId,
    children: (
      <DeleteModal
        note={note}
        deleteNote={deleteNote}
        modalRootId={modalRootId}
      />
    ),
  })

  return <StyledDeleteButton onClick={openDelete} />
}

const StyledDeleteButton = styled('div')`
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
