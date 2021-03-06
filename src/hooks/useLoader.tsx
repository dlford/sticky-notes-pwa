import { useReducer, useEffect } from 'preact/hooks'

let loaderRoot = document.getElementById('LOADING_BAR')
if (!loaderRoot) {
  loaderRoot = document.createElement('div')
  loaderRoot.id = 'LOADING_BAR'
  loaderRoot.setAttribute('aria-hidden', 'true')
  loaderRoot.classList.add('loader')
  document.body.appendChild(loaderRoot)
}

export enum LoaderActions {
  start = 'START',
  stop = 'STOP',
  run = 'RUN',
  step = 'STEP',
  kill = 'KILL',
}

enum LoaderStatus {
  starting = 'STARTING',
  running = 'RUNNING',
  stopping = 'STOPPING',
  stopped = 'STOPPED',
}

export interface LoaderState {
  status: LoaderStatus
  progress: number
}

const initialState: LoaderState = {
  status: LoaderStatus.stopped,
  progress: 0,
}

function reducer(
  state: LoaderState,
  action: LoaderActions,
): LoaderState {
  switch (action) {
    case LoaderActions.start:
      switch (state.status) {
        case LoaderStatus.stopped:
          return { progress: 0, status: LoaderStatus.starting }
        default:
          return state
      }
    case LoaderActions.run:
      switch (state.status) {
        case LoaderStatus.starting:
          return { progress: 3, status: LoaderStatus.running }
        default:
          return state
      }
    case LoaderActions.stop:
      switch (state.status) {
        case LoaderStatus.running:
          return { progress: 100, status: LoaderStatus.stopping }
        case LoaderStatus.starting:
          return initialState
        default:
          return state
      }
    case LoaderActions.kill:
      switch (state.status) {
        case LoaderStatus.stopping:
          return { progress: 0, status: LoaderStatus.stopped }
        default:
          return state
      }
    case LoaderActions.step:
      if (state.progress < 100) {
        return { ...state, progress: state.progress + 1 }
      }
      return state
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

  useEffect(() => {
    if (state.status === LoaderStatus.starting) {
      const delayedStart = setTimeout(() => {
        loaderRoot ? (loaderRoot.style.height = '3px') : null
        dispatch(LoaderActions.run)
      }, 250)
      return () => clearTimeout(delayedStart)
    }
  }, [state.status])

  useEffect(() => {
    if (state.status === LoaderStatus.stopping) {
      const delayedStop = setTimeout(() => {
        loaderRoot ? (loaderRoot.style.height = '0') : null
        dispatch(LoaderActions.kill)
      }, 500)
      return () => clearTimeout(delayedStop)
    }
  }, [state.status])

  useEffect(() => {
    if (
      state.status === LoaderStatus.running &&
      state.progress < 100
    ) {
      loaderRoot ? (loaderRoot.style.height = '3px') : null
      const stepTimout = setTimeout(() => {
        dispatch(LoaderActions.step)
      }, 1000)
      return () => clearTimeout(stepTimout)
    }
  }, [state])

  useEffect(() => {
    if (loaderRoot) {
      loaderRoot.style.width = `${state.progress}%`
    }
  }, [state.progress])

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
