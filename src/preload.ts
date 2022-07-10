import { ipcRenderer, contextBridge } from 'electron'
import * as path from 'path'
import { exec } from 'child_process'
import { readConfig, writeConfig } from './util/config'

const api: Window['electron'] = {
  startTimer: () => {
    ipcRenderer.send('start-timer')
  },
  stopTimer: () => {
    ipcRenderer.send('stop-timer')
  },
  readConfig,
  writeConfig,
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
  getRunningApps: async (): Promise<Application[]> => {
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
    return JSON.parse(apps) as Application[]
  },
  openSlackAuth: () => {
    ipcRenderer.send('open-slack-auth')
  },
}

contextBridge.exposeInMainWorld('electron', api)
