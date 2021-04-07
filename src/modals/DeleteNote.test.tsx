import { h } from 'preact'
import { setup } from 'goober'
import { render } from '@testing-library/preact'
import chai, { expect } from 'chai'
import spies from 'chai-spies'
import DeleteNote from './DeleteNote'

setup(h)
chai.use(spies)

const defaultProps = {
  deleteNote: () => {
    return
  },
  modalRootId: 'DELETE_NOTE_MODAL',
  note: {
    id: 1,
    content: 'I am a note',
    updatedAt: new Date(Date.now()),
    createdAt: new Date(Date.now()),
  },
}

const deleteNote = chai.spy.on(defaultProps, 'deleteNote')

beforeEach(() => {
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.setAttribute('id', 'root')
    document.body.appendChild(rootElement)
  }
})

describe('<DeleteNote>', () => {
  it('does not call deleteNote function when cancelled', () => {
    const { getByText } = render(
      <DeleteNote
        note={defaultProps.note}
        modalRootId={defaultProps.modalRootId}
        deleteNote={deleteNote}
      />,
    )

    const cancelButton = getByText('Keep')

    expect(deleteNote).to.have.not.been.called()

    cancelButton.click()

    expect(deleteNote).to.have.not.been.called()
  })

  it('calls deleteNote function when submitted', () => {
    const { getByText } = render(
      <DeleteNote
        note={defaultProps.note}
        modalRootId={defaultProps.modalRootId}
        deleteNote={deleteNote}
      />,
    )

    const deleteButton = getByText('Delete')

    expect(deleteNote).to.have.not.been.called()

    deleteButton.click()

    expect(deleteNote).to.have.been.called()
  })
})
