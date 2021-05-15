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
}

interface ApplicationOpen {
  name: string
  bounds?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface ApplicationManagerConfig extends Config {
  close: string[]
  open: ApplicationOpen[]
}

interface FocusConfig {
  time: number
  plugins: {
    'application-manager': ApplicationManagerConfig
    bell: Config & {
      volume: number
    }
    rain: Config & {
      volume: number
    }
    slack: Config & {
      token: string
      duration?: number
      statusText?: string
      statusEmoji?: string
    }
    'rescue-time': Config & {
      apiKey: string
      duration: number
    }
  }
}

type TimerActionType = 'START' | 'STOPPING' | 'STOPPED' | 'TICK'

interface TimerAction {
  type: TimerActionType
  payload: Record<string, any>
}
