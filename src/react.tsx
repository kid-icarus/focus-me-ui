import React from 'react'
import {render} from 'react-dom'
import {useEffect, useState} from "react";

const App = () => {
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const handler = window.electron.receive('timer-stopped', () => {
      console.log('timer-stopped')
      setStarted(false)
    })
  }, [])
  return (
    <div>
      <button
        onClick={() => {
          if (started) return window.electron.stopTimer()

          window.electron.startTimer()
          setStarted(true)
        }}
      >{started ? 'Stop' : 'Start'}</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
