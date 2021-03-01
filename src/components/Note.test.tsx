import { h } from 'preact'
import { setup } from 'goober'
import { render } from '@testing-library/preact'
import chai, { expect } from 'chai'
import spies from 'chai-spies'

import Note from './Note.tsx'

setup(h)
chai.use(spies)

const dummyFunctions = {
  updateNote: () => {
    return
  },
  deleteNote: () => {
    return
  },
}

const updateNote = chai.spy.on(dummyFunctions, 'updateNote')
const deleteNote = chai.spy.on(dummyFunctions, 'deleteNote')

beforeEach(() => {
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.setAttribute('id', 'root')
    document.body.appendChild(rootElement)
  }
})

describe('<Note>', () => {
  it('renders the full content of a short note', () => {
    const dummyNote = {
      id: 1,
      content: 'I am a note',
    }

    const { getByText } = render(
      <Note
        note={dummyNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )
    const text = getByText(dummyNote.content)
    expect(typeof text).to.equal('object')
  })

  it('renders truncated content of a long note', () => {
    let dummyLongNote = ''
    for (let i = 0; i < 150; i++) {
      dummyLongNote += 'a'
    }

    const dummyNote = {
      id: 1,
      content: `I am a really long note: ${dummyLongNote}`,
    }

    const { getByText } = render(
      <Note
        note={dummyNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )
    const text = getByText(
      `${dummyNote.content.substring(0, 150)}...`,
    )
    expect(typeof text).to.equal('object')
  })

  // TODO : spy checks, include enter key
})
