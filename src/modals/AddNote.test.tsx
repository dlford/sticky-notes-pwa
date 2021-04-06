import { h } from 'preact'
import { setup } from 'goober'
import { render } from '@testing-library/preact'
import chai, { expect } from 'chai'
import userEvent from '@testing-library/user-event'
import spies from 'chai-spies'
import AddNote from './AddNote'

setup(h)
chai.use(spies)

const defaultProps = {
  createNote: () => {
    return
  },
}

const createNote = chai.spy.on(defaultProps, 'createNote')

beforeEach(() => {
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.setAttribute('id', 'root')
    document.body.appendChild(rootElement)
  }
})

describe('<AddNote>', () => {
  it('calls createNote function when submitted', () => {
    const { getByText, getByLabelText } = render(
      <AddNote createNote={createNote} />,
    )

    const contentField = getByLabelText('New Note')
    const submitButton = getByText('Save')

    expect(createNote).to.have.not.been.called()

    const noteContent = 'This is a new note!'
    userEvent.type(contentField, noteContent)
    submitButton.click()

    expect(createNote).to.have.been.called.with({
      content: noteContent,
    })
  })
})
