interface Window {
  electron: {
    readConfig: () => Promise<FocusConfig>
    writeConfig: (config: FocusConfig) => Promise<void>
    startTimer: () => void
    stopTimer: () => void
    receive: (x: string, y: (...x) => void) => void
    selectApplication: () => Promise<Application>
    getRunningApps: () => Promise<Application[]>
  }
}

interface Application {
  id?: string
  name: string
  displayedName?: string
  bounds?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface Config {
  enabled: boolean
}

interface ApplicationManagerConfig extends Config {
  close: Application[]
  open: Application[]
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

type TimerActionType = 'START' | 'STOPPING' | 'STOPPED' | 'TICK' | 'SELECT_APP'

interface TimerAction {
  type: TimerActionType
  payload: Record<string, any>
}
