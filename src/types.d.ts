interface Window {
  electron: {
    readConfig: () => Promise<FocusConfig>
    writeConfig: (config: FocusConfig) => Promise<void>
    startTimer: () => void
    hehe: string
  }
}

interface Config {
  enabled: boolean
  [key: string]: any
}

interface FocusConfig {
  time: number;
  plugins: Record<string, Config>
}
