import React, {useCallback, useRef} from 'react'
import {render} from 'react-dom'
import {useEffect, useState} from "react";
import {Box, Button, Clock, Grommet, Meter} from "grommet";
import {PlayFill, StopFill} from "grommet-icons";
import styled from 'styled-components'

const App = () => {
  const [started, setStarted] = useState(false)
  const [until, setUntil] = useState<number>(0)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark')
  const endingDuration = useRef(0)
  const endingAt = useRef('')
  const remaining = endingDuration.current ? 100 - Math.floor(until / endingDuration.current * 100)  : 0
  console.log('remaining', remaining, until, 'until', endingDuration.current, 'endingDuration')

  useEffect(() => {
    window.electron.receive('action', (action) => {
      switch (action.type) {
        case 'STOP': {
          setStarted(false)
          setUntil(0)
          endingAt.current = null
          endingDuration.current = 0
          break
        }

        case 'TICK': {
          if (!endingAt.current) {
            endingDuration.current = action.payload.until

            const mins = Math.floor(action.payload.until / 60)
              .toString()
              .padStart(2, '0');

            const secs = (action.payload.until % 60).toString().padStart(2, '0');

            endingAt.current = `T00:${mins}:${secs}`;
          }
          setUntil(action.payload.until)
          break
        }

        case 'START': {
          setStarted(true)
          break
        }

        default: {
          console.error(`dispatching ${action.type} not found`)
        }
      }
    })
  }, [])

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      console.log(`changed to ${e.matches ? "dark" : "light"} mode`)
      setThemeMode(e.matches ? 'dark' : 'light')
    });
  }, [])

  const onClick = useCallback(() => {
    if (started) {
      return window.electron.stopTimer()
    }
    window.electron.startTimer()
  }, [started])

  const Controls = styled.div`
    position: absolute;
  `

  return (
      <Box align="center" justify="center" height="full">
        <Grommet themeMode="dark">
          <Box align="center" justify="center">
            <Meter type="circle" value={remaining}></Meter>
            <Controls align="center" justify="center">
              <Clock size="xxlarge" type="digital" time={endingAt.current || 'T00:00:00'} run={(endingAt.current && started) ? 'backward' : false}></Clock>
              <Box align="center" justify="center" margin="medium">
                <Button
                  plain
                  onClick={onClick}
                  icon={started ? <StopFill /> : <PlayFill/> }
                />
              </Box>
            </Controls>
          </Box>
        </Grommet>
      </Box>
  )
}

render(<App />, document.getElementById('root'))
