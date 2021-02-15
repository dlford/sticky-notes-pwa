import { openDB, IDBPDatabase, DBSchema } from 'idb'

export interface Note {
  id?: number
  title: string
  content: string
  updatedAt: Date
  createdAt: Date
}

export enum DatabaseOperationTypes {
  create = 'CREATE',
  read = 'READ',
  update = 'UPDATE',
  delete = 'DELETE',
}

export interface DatabaseResponse {
  operation: DatabaseOperationTypes
  success: boolean
  payload?: {
    notes?: Note[]
    note?: Note
    id?: number
  }
  error?: {
    message?: string
    payload?: unknown
  }
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

interface NotesDB extends DBSchema {
  notes: {
    key: string
    value: Note
  }
}

let database: IDBPDatabase<NotesDB>
export const dbName = 'stickyNotes'
export const dbVersion = 1
export const tableName = 'notes'

export async function setupDB(): Promise<DatabaseResponse> {
  try {
    database = await openDB<NotesDB>(dbName, dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(tableName)) {
          db.createObjectStore(tableName, {
            autoIncrement: true,
            keyPath: 'id',
          })
        }
      },
    })
    return {
      success: true,
      operation: DatabaseOperationTypes.read,
    }
  } catch (err: unknown) {
    return {
      success: false,
      operation: DatabaseOperationTypes.read,
      error: {
        message: `setupDB error: Failed to connect to database`,
        payload: err,
      },
    }
  }
}

export function sortNotes(notes: Note[]): Note[] {
  return notes.sort((a, b) => {
    const keyA = new Date(a.updatedAt)
    const keyB = new Date(b.updatedAt)
    if (keyA < keyB) return 1
    if (keyB < keyA) return -1
    return 0
  })
}

export async function getData(): Promise<DatabaseResponse> {
  if (!database) {
    return {
      success: false,
      operation: DatabaseOperationTypes.read,
      error: {
        message: `getData error: Database failed to load`,
      },
    }
  }

  const tx = database.transaction(tableName, 'readonly')
  const store = tx.objectStore(tableName)
  const result = await store.getAll()

  const sorted = sortNotes(result)

  return {
    success: true,
    operation: DatabaseOperationTypes.read,
    payload: {
      notes: sorted,
    },
  }
}

export async function createNote({
  title,
  content,
}: CreateNoteInput): Promise<DatabaseResponse> {
  if (!database) {
    return {
      success: false,
      operation: DatabaseOperationTypes.create,
      error: {
        message: 'createNote error: Database failed to load',
      },
    }
  }

  const tx = database.transaction(tableName, 'readwrite')
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
    return {
      success: false,
      operation: DatabaseOperationTypes.create,
      error: {
        message: 'createNote error: Failed to insert note',
      },
    }
  }

  const newNote: Note = {
    id,
    title,
    content,
    updatedAt,
    createdAt: updatedAt,
  }

  return {
    success: true,
    operation: DatabaseOperationTypes.create,
    payload: {
      note: newNote,
    },
  }
}

export async function updateNote({
  id,
  title,
  content,
  createdAt,
}: UpdateNoteInput): Promise<DatabaseResponse> {
  if (!database) {
    return {
      success: false,
      operation: DatabaseOperationTypes.update,
      error: {
        message: 'updateNote error: Database failed to load',
      },
    }
  }

  const tx = database.transaction(tableName, 'readwrite')
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
    return {
      success: false,
      operation: DatabaseOperationTypes.update,
      error: {
        message: 'updateNote error: Failed to update note',
      },
    }
  }

  const newNote = {
    id,
    title,
    content,
    updatedAt,
    createdAt,
  }

  return {
    success: true,
    operation: DatabaseOperationTypes.update,
    payload: {
      note: newNote,
    },
  }
}

export async function deleteNote({
  id,
}: DeleteNoteInput): Promise<DatabaseResponse> {
  if (!database) {
    return {
      success: false,
      operation: DatabaseOperationTypes.delete,
      error: {
        message: 'deleteNote error: Database failed to load',
      },
    }
  }

  const tx = database.transaction(tableName, 'readwrite')
  const store = tx.objectStore(tableName)
  await store.delete(IDBKeyRange.only(id))

  return {
    success: true,
    operation: DatabaseOperationTypes.delete,
    payload: {
      id,
    },
  }
}
