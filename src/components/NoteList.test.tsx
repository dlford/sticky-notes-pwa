/* eslint-disable @typescript-eslint/no-explicit-any */

import { h } from 'preact'
import { setup } from 'goober'
import { render, cleanup } from '@testing-library/preact'
import { expect } from 'chai'

import NoteList from './NoteList'

setup(h)

beforeEach(() => {
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.setAttribute('id', 'root')
    document.body.appendChild(rootElement)
  }
})

afterEach(cleanup)

const updateNote: any = () => {
  return
}
const deleteNote: any = () => {
  return
}

describe('<NoteList>', () => {
  it('renders notes on the page', () => {
    const data = [
      {
        id: 1,
        content: 'I am note one',
        updatedAt: new Date(Date.now()),
        createdAt: new Date(Date.now()),
      },
      {
        id: 2,
        content: 'I am note two',
        updatedAt: new Date(Date.now()),
        createdAt: new Date(Date.now()),
      },
    ]

    const { getByText } = render(
      <NoteList
        loading={false}
        error={[]}
        data={data}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    const noteOne = getByText(data[0].content)
    const noteTwo = getByText(data[1].content)

    expect(typeof noteOne).to.equal('object')
    expect(typeof noteTwo).to.equal('object')
  })

  it('displays a message if no notes exist', () => {
    const { getByText } = render(
      <NoteList
        loading={false}
        error={[]}
        data={[]}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    const message = getByText(
      'No notes found, click the Add Note button to get started!',
    )
    expect(typeof message).to.equal('object')
  })

  it('displays errors if any exist', () => {
    const error = [
      {
        id: 1,
        message: 'Oh no!',
      },
    ]

    const { getByText } = render(
      <NoteList
        loading={false}
        error={error}
        data={[]}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    const message = getByText(JSON.stringify(error))
    expect(typeof message).to.equal('object')
  })

  it('returns null if loading is true', () => {
    const { asFragment } = render(
      <NoteList
        loading={true}
        error={[]}
        data={[]}
        updateNote={updateNote}
        deleteNote={deleteNote}
      />,
    )

    expect(asFragment().childNodes.length).to.equal(0)
  })
})
