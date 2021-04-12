import {app, ipcMain, Menu, Tray, globalShortcut, BrowserWindow} from 'electron'
import { Timer } from '@focus-me/focus-cli/dist/timer'
import { loadPlugins } from '@focus-me/focus-cli/dist/util/load-plugins'
import * as path from 'path'
import {readFile} from "fs/promises";
import {exec} from "child_process";

const TIMERRC_PATH = path.join(process.env.HOME, '.timerrc.json')
const readConfig = async (): Promise<FocusConfig> => JSON.parse(await readFile(TIMERRC_PATH, 'utf8')) as unknown as FocusConfig

let timer
let childProc

app.on('will-quit', () => {
  if (childProc) childProc.kill('SIGINT')
})

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  win.loadFile('index.html');

  // todo: clean this up on window destroy.
  ipcMain.on('stop-timer', (e) => {
    if (childProc) {
      childProc.kill('SIGINT')
      childProc = null
    }
    win.webContents.send('timer-stopped', {})
  })

  ipcMain.on('start-timer', async (e) => {
    childProc = exec('focus', () => {
      childProc = null
      win.webContents.send('timer-stopped', {})
    })
  })
}

function createPreferencesWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  win.loadFile('preferences.html');
}

let tray

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '..', 'public', 'GroupTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Help...' },
    { label: 'Preferences...', click: () => {createPreferencesWindow()}},
  ])
  tray.setToolTip('Focus')
  tray.setContextMenu(contextMenu)
  globalShortcut.register('Command+,', createPreferencesWindow)
  createWindow()
});
