import { render, JSX } from 'preact'
import { useReducer, useEffect } from 'preact/hooks'

export enum LoaderActions {
  start = 'START',
  stop = 'STOP',
  run = 'RUN',
}

enum LoaderStates {
  starting = 'STARTING',
  running = 'RUNNING',
  stopped = 'STOPPED',
}

const initialState = LoaderStates.running

function reducer(
  state: LoaderStates,
  action: LoaderActions,
): LoaderStates {
  switch (action) {
    case LoaderActions.start:
      switch (state) {
        case LoaderStates.stopped:
          return LoaderStates.starting
        default:
          return state
      }
    case LoaderActions.run:
      switch (state) {
        case LoaderStates.starting:
          return LoaderStates.running
        default:
          return state
      }
    case LoaderActions.stop:
      return LoaderStates.stopped
    default:
      throw new Error('Unknown action type')
  }
}

export interface UseLoader {
  start(): void
  stop(): void
}

export default function useLoader(): UseLoader {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state === LoaderStates.starting) {
      const delayedStart = setTimeout(() => {
        dispatch(LoaderActions.run)
      }, 250)
      return () => clearTimeout(delayedStart)
    }
  }, [state])

  function start() {
    dispatch(LoaderActions.start)
  }

  function stop() {
    dispatch(LoaderActions.stop)
  }

  const loaderRoot = document.createElement('div')
  loaderRoot.setAttribute('aria-hidden', 'true')
  // TODO : style loader
  // TODO : render loader

  return {
    start,
    stop,
  }
}
