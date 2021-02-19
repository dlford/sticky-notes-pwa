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

const initialState = LoaderStates.stopped

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
  startLoader(): void
  stopLoader(): void
}

export default function useLoader(): UseLoader {
  const [state, dispatch] = useReducer(reducer, initialState)

  let loaderRoot = document.getElementById('LOADING_BAR')
  if (!loaderRoot) {
    loaderRoot = document.createElement('div')
    loaderRoot.id = 'LOADING_BAR'
    loaderRoot.setAttribute('aria-hidden', 'true')
    loaderRoot.style.position = 'absolute'
    loaderRoot.style.top = '0'
    loaderRoot.style.left = '0'
    loaderRoot.style.width = '100%'
    loaderRoot.style.height = '3px'
    loaderRoot.style.backgroundColor = 'black'
    loaderRoot.style.zIndex = '10'
    loaderRoot.style.visibility = 'hidden'
    // TODO : style loader in CSS and add className here
    document.body.appendChild(loaderRoot)
  }

  useEffect(() => {
    if (state === LoaderStates.starting) {
      const delayedStart = setTimeout(() => {
        dispatch(LoaderActions.run)
      }, 250)
      return () => clearTimeout(delayedStart)
    }
  }, [state])

  useEffect(() => {
    if (loaderRoot) {
      if (state === LoaderStates.running) {
        loaderRoot.style.visibility = 'visible'
      } else {
        loaderRoot.style.visibility = 'hidden'
      }
    }
  }, [state, loaderRoot])

  function startLoader() {
    dispatch(LoaderActions.start)
  }

  function stopLoader() {
    dispatch(LoaderActions.stop)
  }

  return {
    startLoader,
    stopLoader,
  }
}
