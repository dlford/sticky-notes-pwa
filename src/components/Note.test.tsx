/* eslint-disable @typescript-eslint/no-explicit-any */

import { h } from 'preact'
import { setup } from 'goober'
import { render } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { expect } from 'chai'

import Note from './Note'

setup(h)

const updateNote: any = {}
const deleteNote: any = {}

beforeEach(() => {
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.setAttribute('id', 'root')
    document.body.appendChild(rootElement)
  }
  rootElement.removeAttribute('inert')

  const updateModal = document.getElementById('EDIT_NOTE_MODAL')
  const deleteModal = document.getElementById('DELETE_NOTE_MODAL')
  if (updateModal) {
    updateModal.setAttribute('inert', 'true')
  }
  if (deleteModal) {
    deleteModal.setAttribute('inert', 'true')
  }
})

describe('<Note>', () => {
  it('renders the full content of a short note', () => {
    const dummyNote = {
      id: 1,
      content: 'I am a note',
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
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
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
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

  it('opens deleteNote modal when delete button is clicked', () => {
    const dummyNote = {
      id: 1,
      content: 'I am a note',
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
    }

    const { getByLabelText } = render(
      <Note
        note={dummyNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    const deleteNoteButton = getByLabelText('Delete Note')

    const deleteNoteModal = document.getElementById(
      'DELETE_NOTE_MODAL',
    )
    const rootElement = document.getElementById('root')

    expect(deleteNoteModal?.getAttribute('inert')).to.equal('true')
    expect(rootElement?.getAttribute('inert')).not.to.equal('true')

    deleteNoteButton.click()
    expect(deleteNoteModal?.getAttribute('inert')).to.not.equal(
      'true',
    )
    expect(rootElement?.getAttribute('inert')).to.equal('true')
  })

  it('opens updateNote modal when update button is clicked', () => {
    const dummyNote = {
      id: 1,
      content: 'I am a note',
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
    }

    const { getByLabelText } = render(
      <Note
        note={dummyNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    const updateNoteButton = getByLabelText('Edit Note')

    const updateNoteModal = document.getElementById('EDIT_NOTE_MODAL')
    const rootElement = document.getElementById('root')

    expect(updateNoteModal?.getAttribute('inert')).to.equal('true')
    expect(rootElement?.getAttribute('inert')).not.to.equal('true')

    updateNoteButton.click()
    expect(updateNoteModal?.getAttribute('inert')).to.not.equal(
      'true',
    )
    expect(rootElement?.getAttribute('inert')).to.equal('true')
  })

  it('opens deleteNote modal when enter key is pressed on delete button', () => {
    const dummyNote = {
      id: 1,
      content: 'I am a note',
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
    }

    const { getByLabelText } = render(
      <Note
        note={dummyNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    const deleteNoteButton = getByLabelText('Delete Note')

    const deleteNoteModal = document.getElementById(
      'DELETE_NOTE_MODAL',
    )
    const rootElement = document.getElementById('root')

    expect(deleteNoteModal?.getAttribute('inert')).to.equal('true')
    expect(rootElement?.getAttribute('inert')).not.to.equal('true')

    userEvent.type(deleteNoteButton, '{enter}')
    expect(deleteNoteModal?.getAttribute('inert')).to.not.equal(
      'true',
    )
    expect(rootElement?.getAttribute('inert')).to.equal('true')
  })

  it('opens updateNote modal when enter key is pressed on update button', () => {
    const dummyNote = {
      id: 1,
      content: 'I am a note',
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
    }

    const { getByLabelText } = render(
      <Note
        note={dummyNote}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    const updateNoteButton = getByLabelText('Edit Note')

    const updateNoteModal = document.getElementById('EDIT_NOTE_MODAL')
    const rootElement = document.getElementById('root')

    expect(updateNoteModal?.getAttribute('inert')).to.equal('true')
    expect(rootElement?.getAttribute('inert')).not.to.equal('true')

    userEvent.type(updateNoteButton, '{enter}')
    expect(updateNoteModal?.getAttribute('inert')).to.not.equal(
      'true',
    )
    expect(rootElement?.getAttribute('inert')).to.equal('true')
  })
})
