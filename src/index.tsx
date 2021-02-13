import { h, render } from 'preact'
import { setup } from 'goober'
import 'preact/devtools'

import App from './App.js'

setup(h)

const root = document.getElementById('root')

if (root) {
  render(<App />, root)
}
