interface Window {
  electron: {
    readConfig: () => Promise<FocusConfig>
    writeConfig: (config: FocusConfig) => Promise<void>
    startTimer: () => void
    stopTimer: () => void
    receive: (x: string, y: (...x) => void) => void
  }
}

interface Config {
  enabled: boolean
  [key: string]: any
}

interface FocusConfig {
  time: number
  plugins: Record<string, Config>
}

type TimerActionType = 'START' | 'STOPPING' | 'STOPPED' | 'TICK'

interface TimerAction {
  type: TimerActionType
  payload: Record<string, any>
}
