import { ipcRenderer, contextBridge } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import * as path from 'path'

const TIMERRC_PATH = path.join(process.env.HOME, '.timerrc.json')

const readConfig = async (): Promise<FocusConfig> =>
  (JSON.parse(await readFile(TIMERRC_PATH, 'utf8')) as unknown) as FocusConfig

contextBridge.exposeInMainWorld('electron', {
  startTimer: () => {
    ipcRenderer.send('start-timer')
  },
  stopTimer: () => {
    ipcRenderer.send('stop-timer')
  },
  readConfig,
  writeConfig: async (config: FocusConfig): Promise<void> =>
    await writeFile(TIMERRC_PATH, JSON.stringify(config, null, 2)),
  receive: (channel, func: (...x: unknown[]) => void) => {
    const validChannels = ['fromMain', 'timer-stopped', 'action']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
})
