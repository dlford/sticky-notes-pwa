import { h, render } from 'preact'
import { setup } from 'goober'
import 'preact/devtools'

import App from './App.js'
import './index.css'

setup(h)

const root = document.getElementById('root')

if (root) {
  render(<App />, root)
}
