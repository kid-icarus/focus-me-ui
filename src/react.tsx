import * as React from 'react'
import {render} from 'react-dom'

const App = () => {
  return (
    <div>
      <button onClick={window.electron.startTimer}>Heh</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
