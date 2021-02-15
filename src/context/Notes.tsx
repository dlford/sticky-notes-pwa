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

export const NotesContext = createContext<NotesConsumerProps>({
  data: [],
  loading: true,
  error: [],
  createNote: () => {
    return new Promise((resolve) => resolve(false))
  },
  updateNote: () => {
    return new Promise((resolve) => resolve(false))
  },
  deleteNote: () => {
    return new Promise((resolve) => resolve(false))
  },
})

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

  return (
    <NotesContext.Provider
      value={{
        data,
        loading,
        error,
        createNote: async ({ title, content }) => {
          setLoading(true)
          const result = await createNote({ title, content })
          if (result.success && !!result?.payload?.note) {
            setData((prev) => {
              sortNotes([...prev, result.payload.note])
            })
          }
          setLoading(false)
          return true
        },
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export default NotesContext
