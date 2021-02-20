import { useReducer, useEffect } from 'preact/hooks'

// TODO : Tracker loader width in state, jump to 100 on stopping, then hide before resetting to 0

export enum LoaderActions {
  start = 'START',
  stop = 'STOP',
  run = 'RUN',
  kill = 'KILL',
}

enum LoaderStates {
  starting = 'STARTING',
  running = 'RUNNING',
  stopping = 'STOPPING',
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
      switch (state) {
        case LoaderStates.running:
          return LoaderStates.stopping
        default:
          return LoaderStates.stopped
      }
    case LoaderActions.kill:
      switch (state) {
        case LoaderStates.stopping:
          return state
        default:
          return LoaderStates.stopped
      }
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
    loaderRoot.classList.add('loader')
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
    if (state === LoaderStates.stopping) {
      const delayedStop = setTimeout(() => {
        dispatch(LoaderActions.kill)
      }, 250)
      return () => clearTimeout(delayedStop)
    }
  }, [state])

  useEffect(() => {
    if (loaderRoot) {
      if (
        state === LoaderStates.running ||
        state === LoaderStates.stopping
      ) {
        let i = 5
        const loadingInterval = setInterval(() => {
          if (loaderRoot?.style?.width) {
            loaderRoot.style.width = `${i}`
            i++
          }
        }, 100)
        return clearInterval(loadingInterval)
      }

      loaderRoot.style.width = '0'
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
