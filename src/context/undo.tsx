import { h, JSX, createContext } from 'preact'
import { useReducer, useContext, Reducer } from 'preact/hooks'

import type { Note } from '~/hooks/useNotes'

export interface UndoContextProps {
  state: Note | void
  dispatch: Reducer<UndoReducer['action'], Note | void>
}

export enum UndoActions {
  push = 'PUSH',
  clear = 'CLEAR',
}

export interface UndoReducer {
  action: {
    type: UndoActions
    payload: UndoContextProps['state']
  }
}

export interface UndoProviderProps {
  children: JSX.Element
}

const initialState = undefined

function reducer(
  action: UndoReducer['action'],
): UndoContextProps['state'] {
  switch (action.type) {
    case UndoActions.push:
      if (!action.payload) {
        throw new Error('Missing payload')
      }
      return action.payload
    case UndoActions.clear:
      return initialState
    default:
      throw new Error('Unknown action type')
  }
}

export const UndoContext = createContext<UndoContextProps>({
  state: undefined,
  dispatch: ({ type, payload }) => {
    // This is a dummy function that will
    // be replaced by UndoContext.Provider
    return { type, payload }
  },
})

export function UndoProvider({
  children,
}: UndoProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, undefined)

  return (
    <UndoContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </UndoContext.Provider>
  )
}

/*
export interface UseUndo {
  undoItem: UndoContextProps['state']
  dispatch(
    arg0: UndoContextProps['reducer'],
  ): UndoContextProps['state']
}

export default function useUndo(): UseUndo {
  const [state, dispatch] = useContext(UndoContext)

  return {
    state,
    dispatch,
    UndoActions,
  }
}
 */
