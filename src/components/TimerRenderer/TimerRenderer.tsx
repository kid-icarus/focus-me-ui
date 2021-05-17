import React, { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { Box, Button, Clock, Grommet, Meter } from 'grommet'
import { PlayFill, StopFill } from 'grommet-icons'
import styled from 'styled-components'

const Controls = styled.div`
  position: absolute;
`

const App = () => {
  const [started, setStarted] = useState(false)
  const [stopped, setStopped] = useState(true)
  const [until, setUntil] = useState<number>(0) // This is updated every sec
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark')
  const [duration, setDuration] = useState(0) // This should be updated once
  const remaining = duration
    ? until
      ? 100 - Math.floor((until / duration) * 100)
      : 0
    : 0
  const endingAt = React.useRef('')

  useEffect(() => {
    window.electron.receive('action', (action: TimerAction) => {
      switch (action.type) {
        case 'STOPPING': {
          endingAt.current = ''
          setStarted(false)
          setStopped(false)
          setUntil(0)
          setDuration(0)
          break
        }

        case 'STOPPED': {
          setStopped(true)
          break
        }

        case 'TICK': {
          setUntil(action.payload.until)
          break
        }

        case 'START': {
          const mins = Math.floor(action.payload.until / 60)
            .toString()
            .padStart(2, '0')

          const secs = (action.payload.until % 60).toString().padStart(2, '0')
          endingAt.current = `T00:${mins}:${secs}`

          setStarted(true)
          setDuration(action.payload.until)

          break
        }
      }
    })
  }, [])

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function (e) {
        console.log(`changed to ${e.matches ? 'dark' : 'light'} mode`)
        setThemeMode(e.matches ? 'dark' : 'light')
      })
  }, [])

  const onClick = useCallback(() => {
    if (started) {
      return window.electron.stopTimer()
    }
    window.electron.startTimer()
  }, [started])

  return (
    <Box align="center" justify="center" height="100vh">
      <Grommet themeMode={themeMode}>
        <Box align="center" justify="center">
          <Meter type="circle" value={remaining} />
          <Controls>
            <Clock
              size="xxlarge"
              type="digital"
              time={endingAt.current || 'T00:00:00'}
              run={endingAt.current && started ? 'backward' : false}
            />
            <Box align="center" justify="center" margin="medium">
              <Button
                disabled={!started && !stopped}
                plain
                onClick={onClick}
                icon={started ? <StopFill /> : <PlayFill />}
              />
            </Box>
          </Controls>
        </Box>
      </Grommet>
    </Box>
  )
}

export default App
