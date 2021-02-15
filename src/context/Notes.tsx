import { h, JSX, createContext } from 'preact'
import { useState, useEffect, useCallback } from 'preact/hooks'

import {
  getData,
  createNote,
  updateNote,
  deleteNote,
  sortNotes,
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  DeleteNoteInput,
} from '~/lib/database'

export interface NotesConsumerProps {
  data: Note[]
  loading: boolean
  error: unknown[]
  createNote(arg0: CreateNoteInput): Promise<boolean>
  updateNote(arg0: UpdateNoteInput): Promise<boolean>
  deleteNote(arg0: DeleteNoteInput): Promise<boolean>
}

export interface NotesProviderProps {
  children: JSX.Element | JSX.Element[]
}

let NotesContext

export function NotesProvider({
  children,
}: NotesProviderProps): JSX.Element {
  const [data, setData] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown[]>([])

  useEffect(() => {
    getData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [])

  async function createNote({ title, content }): Promise<boolean> {
    setLoading(true)
    const result = await createNote({ title, content })
    if (result.success && !!result?.payload?.note) {
      setData((prev) => {
        sortNotes([...prev, result.payload.note])
      })
    }
    setLoading(false)
    return true
  }

  async function updateNote(): Promise<boolean> {
    return new Promise((resolve) => resolve(false))
  }

  async function deleteNote(): Promise<boolean> {
    return new Promise((resolve) => resolve(false))
  }

  NotesContext = createContext<NotesConsumerProps>({
    data: [],
    loading: true,
    error: [],
    createNote,
    updateNote,
    deleteNote,
  })

  return (
    <NotesContext.Provider
      value={{
        data,
        loading,
        error,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export default NotesContext
