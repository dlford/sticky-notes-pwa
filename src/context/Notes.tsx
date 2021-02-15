import { h, JSX, createContext } from 'preact'
import {
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'preact/hooks'

import { openDB, IDBPDatabase, DBSchema } from 'idb'

export interface Note {
  id?: number
  title: string
  content: string
  updatedAt: Date
  createdAt: Date
}

export interface CreateNoteInput {
  title: Note['title']
  content: Note['content']
}

export interface UpdateNoteInput {
  id: Note['id']
  title: Note['title']
  content: Note['content']
  createdAt: Note['createdAt']
}

export interface DeleteNoteInput {
  id: number
}

export interface UseNotes {
  isDbLoaded: boolean
  data: Note[]
  loading: boolean
  error: unknown[]
  createNote(arg0: CreateNoteInput): Promise<boolean>
  updateNote(arg0: UpdateNoteInput): Promise<boolean>
  deleteNote(arg0: DeleteNoteInput): Promise<boolean>
}

interface NotesDB extends DBSchema {
  notes: {
    key: string
    value: Note
  }
}

export interface NotesConsumerProps {
  data: Note[]
  setData(arg0: Note[]): void
}

export interface NotesProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const NotesContext = createContext<NotesConsumerProps>({
  data: [],
  setData() {
    return
  },
})

export function NotesProvider({
  children,
}: NotesProviderProps): JSX.Element {
  const [data, setData] = useState<Note[]>([])

  return (
    <NotesContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export default function useNotes(): UseNotes {
  const { data, setData } = useContext(NotesContext)
  const [db, setDb] = useState<IDBPDatabase<NotesDB> | void>(
    undefined,
  )
  const [isDbLoaded, setIsDbLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown[]>([])

  const dbName = 'stickyNotes'
  const dbVersion = 1
  const tableName = 'notes'

  // Sorts an array of notes by most recently updated first
  function sortNotes(notes: Note[]): Note[] {
    return notes.sort((a, b) => {
      const keyA = new Date(a.updatedAt)
      const keyB = new Date(b.updatedAt)
      if (keyA < keyB) return 1
      if (keyB < keyA) return -1
      return 0
    })
  }

  const getData = useCallback(async (): Promise<boolean> => {
    if (!db || !isDbLoaded) {
      const message = `getData error: Database failed to load`
      setError((prev) => [...prev, message])
      return false
    }

    const tx = db.transaction(tableName, 'readonly')
    const store = tx.objectStore(tableName)
    const result = await store.getAll()

    const sorted = sortNotes(result)

    setData(sorted)
    return true
  }, [db, isDbLoaded, setData])

  // Connect to indexedDB on load
  useEffect(() => {
    async function setupDb() {
      if (!db && !error.length) {
        try {
          const database = await openDB<NotesDB>(dbName, dbVersion, {
            upgrade(db) {
              if (!db.objectStoreNames.contains(tableName)) {
                db.createObjectStore(tableName, {
                  autoIncrement: true,
                  keyPath: 'id',
                })
              }
            },
          })
          setDb(database)
          setIsDbLoaded(true)
        } catch (err: unknown) {
          setError((prev) => [...prev, err])
        }
      }
    }
    setupDb()
  }, [error, db, getData])

  // Fetch data when indexedDB is connected
  useEffect(() => {
    if (isDbLoaded && db) {
      getData()
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
    }
  }, [db, isDbLoaded, getData])

  async function createNote({
    title,
    content,
  }: CreateNoteInput): Promise<boolean> {
    if (!db || !isDbLoaded) {
      const message = 'createNote error: Database failed to load'
      setError((prev) => [...prev, message])
      return false
    }

    setLoading(true)
    const tx = db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    const updatedAt = new Date(Date.now())
    const idString = await store.put({
      title,
      content,
      updatedAt,
      createdAt: updatedAt,
    })

    const id = parseInt(idString, 10)

    if (!id || isNaN(id)) {
      const message = 'createNote error: Failed to insert note'
      setError((prev) => [...prev, message])
      return false
    }

    const newNote: Note = {
      id,
      title,
      content,
      updatedAt,
      createdAt: updatedAt,
    }

    const newData = sortNotes([...data, newNote])
    setData(newData)

    setLoading(false)
    return true
  }

  async function updateNote({
    id,
    title,
    content,
    createdAt,
  }: UpdateNoteInput): Promise<boolean> {
    if (!db || !isDbLoaded) {
      const message = 'updateNote error: Database failed to load'
      setError((prev) => [...prev, message])
      return false
    }

    setLoading(true)
    const tx = db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    const updatedAt = new Date(Date.now())
    const idString = await store.put({
      id,
      title,
      content,
      updatedAt,
      createdAt,
    })

    const resultId = parseInt(idString, 10)

    if (!resultId || resultId !== id) {
      const message = 'updateNote error: Failed to update note'
      setError((prev) => [...prev, message])
      return false
    }

    const newData = sortNotes(
      data.map((note) => {
        if (note.id === id) {
          return {
            id,
            title,
            content,
            updatedAt,
            createdAt,
          }
        }
        return note
      }),
    )
    setData(newData)

    setLoading(false)
    return true
  }

  async function deleteNote({
    id,
  }: DeleteNoteInput): Promise<boolean> {
    if (!db || !isDbLoaded) {
      const message = 'deleteNote error: Database failed to load'
      setError((prev) => [...prev, message])
      return false
    }

    setLoading(true)
    const tx = db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    await store.delete(IDBKeyRange.only(id))

    const newData = sortNotes(data.filter((note) => note.id !== id))
    setData(newData)

    setLoading(false)
    return true
  }

  return {
    isDbLoaded,
    data,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
  }
}
