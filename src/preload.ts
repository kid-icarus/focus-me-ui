import { ipcRenderer, contextBridge } from 'electron'
import {readFile, writeFile} from 'fs/promises'
import * as path from 'path'

const TIMERRC_PATH = path.join(process.env.HOME, '.timerrc.json')

const readConfig = async (): Promise<FocusConfig> => JSON.parse(await readFile(TIMERRC_PATH, 'utf8')) as unknown as FocusConfig

let timer

contextBridge.exposeInMainWorld('electron', {
  startTimer: () => {
    ipcRenderer.send('start-timer')
    window.dispatchEvent(new CustomEvent('timer-started'))
  },
  stopTimer: () => {
    ipcRenderer.send('stop-timer')
    window.dispatchEvent(new CustomEvent('timer-stopped'))
  },
  readConfig,
  writeConfig: async (config: FocusConfig): Promise<void> => await writeFile(TIMERRC_PATH, JSON.stringify(config, null, 2)),
  receive: (channel, func: (...x: any) => void) => {
    let validChannels = ['fromMain', 'timer-stopped'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
})
