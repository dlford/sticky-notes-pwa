import { h, JSX } from 'preact'
import { styled } from 'goober'

import useNotes from '~/hooks/useNotes'
import AddNote from '~/components/AddNote'
import useModal from '~/hooks/useModal'
import NoteList from '~/components/NoteList'

function App(): JSX.Element {
  const { data, loading, error, createNote, deleteNote } = useNotes()

  const { open } = useModal({
    modalRootId: 'ADD_NOTE_MODAL',
    children: <AddNote createNote={createNote} />,
  })

  return (
    <StyledPage className='App'>
      <Navbar>
        <h1 className='h3'>Sticky Notes</h1>
        <button className='primary' onClick={open}>
          Add Note
        </button>
      </Navbar>
      <NoteList {...{ data, loading, error, deleteNote }} />
    </StyledPage>
  )
}

export default App

const StyledPage = styled('main')`
  max-width: 60rem;
  margin: 0 auto;
  padding: 1rem;
`

const Navbar = styled('nav')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
