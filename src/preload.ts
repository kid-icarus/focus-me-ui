import { ipcRenderer, contextBridge } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import * as path from 'path'
import { exec } from 'child_process'

const TIMERRC_PATH = path.join(process.env.HOME, '.timerrc.json')

const readConfig = async (): Promise<FocusConfig> =>
  (JSON.parse(await readFile(TIMERRC_PATH, 'utf8')) as unknown) as FocusConfig

const api: Window['electron'] = {
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
  selectApplication: async (): Promise<Application> => {
    const proc = new Promise<string>((res, rej) => {
      exec(
        `osascript ${path.join(
          __dirname,
          'applescripts',
          'getApplication.js'
        )}`,
        (err, stdout, stderr) => {
          if (err) return rej(err)
          res(stderr)
        }
      )
    })
    const appName = await proc
    return JSON.parse(appName) as Application
  },
  getRunningApps: async (): Promise<[]> => {
    const proc = new Promise<string>((res, rej) => {
      exec(
        `osascript ${path.join(
          __dirname,
          'applescripts',
          'getRunningApps.js'
        )}`,
        (err, stdout, stderr) => {
          if (err) return rej(err)
          res(stderr)
        }
      )
    })
    const apps = await proc
    return JSON.parse(apps)
  },
}

contextBridge.exposeInMainWorld('electron', api)
