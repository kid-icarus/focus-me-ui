import {app, ipcMain, Menu, Tray, globalShortcut, BrowserWindow} from 'electron'
import { Timer } from '@focus-me/focus-cli/dist/timer'
import { loadPlugins } from '@focus-me/focus-cli/dist/util/load-plugins'
import * as path from 'path'
import {readFile} from 'fs/promises';

const TIMERRC_PATH = path.join(process.env.HOME, '.timerrc.json')
const readConfig = async (): Promise<FocusConfig> => JSON.parse(await readFile(TIMERRC_PATH, 'utf8')) as unknown as FocusConfig

let timer
let childProc

app.on('will-quit', () => {
  timer?.stop();
})

app.dock.setIcon(path.join(__dirname, '..', 'public', 'Enso.png'))

async function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  const handleStopped = () => {
    win.webContents.send('timer-stopped', {})
    win.webContents.send('action', {
      type: 'STOP',
    })
  }

  const handleTick = (until: number) => {
    console.log(until)
    win.webContents.send('action', {
      type: 'TICK',
      payload: {
        until
      }
    })
  }

  // todo: clean this up on window destroy.
  ipcMain.on('stop-timer', (e) => {
    timer.stop()
  })

  ipcMain.on('start-timer', async (e) => {
    const config = await readConfig()
    const plugins = loadPlugins(config)
    timer = new Timer(config, plugins)
    timer.on('stopped', handleStopped)
    timer.on('tick', handleTick)
    timer.start()
  })

  ipcMain.on('toggle', async (e) => {
    if (!childProc) return ipcMain.emit('start-timer')

    ipcMain.emit('stop-timer')
  })

  win.loadFile('index.html');
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
    { label: 'Preferences...',
      accelerator: 'CommandOrControl+,',
      registerAccelerator: true,
      click: createPreferencesWindow
    },
  ])
  tray.setToolTip('Focus')
  tray.setContextMenu(contextMenu)
  globalShortcut.register('Command+Shift+,', () => ipcMain.emit('toggle'))
  createWindow()
});
