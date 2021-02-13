import { h, render } from 'preact'
import { setup } from 'goober'
import 'preact/devtools'
import '~/styles/normalize.css'
import '~/styles/index.css'

import App from './App.js'

setup(h)

const root = document.getElementById('root')

if (root) {
  render(<App />, root)
}
