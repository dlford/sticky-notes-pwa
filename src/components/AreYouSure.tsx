import { h, JSX } from 'preact'

import useModal from '~/hooks/useModal'

export default function AreYouSure(): JSX.Element {
  const { close } = useModal({ modalRootId: 'ARE_YOU_SURE_MODAL' })

  function handleYes() {
    close()
  }

  return (
    <>
      <button onClick={handleYes}>Yes</button>
      <button onClick={close}>No</button>
    </>
  )
}
