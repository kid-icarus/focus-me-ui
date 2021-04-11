import { ipcRenderer, contextBridge } from 'electron'
import {readFile, writeFile} from 'fs/promises'
import * as path from 'path'

const TIMERRC_PATH = path.join(process.env.HOME, '.timerrc.json')

contextBridge.exposeInMainWorld('electron', {
  startTimer: () => ipcRenderer.invoke('start-timer'),
  stopTimer: () => ipcRenderer.invoke('stop-timer'),
  readConfig: async (): Promise<FocusConfig> => JSON.parse(await readFile(TIMERRC_PATH, 'utf8')) as unknown as FocusConfig,
  writeConfig: async (config): Promise<void> => await writeFile(TIMERRC_PATH, JSON.stringify(config, null, 2))
})
