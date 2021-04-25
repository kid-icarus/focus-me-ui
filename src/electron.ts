import {app, ipcMain, Menu, Tray, globalShortcut, BrowserWindow, nativeTheme} from 'electron'
import { Timer } from '@focus-me/focus-cli/dist/timer'
import { loadPlugins } from '@focus-me/focus-cli/dist/util/load-plugins'
import * as path from 'path'
import {readFile} from 'fs/promises';

const TIMERRC_PATH = path.join(process.env.HOME, '.timerrc.json')
const readConfig = async (): Promise<FocusConfig> => JSON.parse(await readFile(TIMERRC_PATH, 'utf8')) as unknown as FocusConfig

let timer: Timer
(async () => {
  const config = await readConfig()
  const plugins = loadPlugins(config)
  timer = new Timer(config, plugins)
})()

nativeTheme.themeSource = 'system'

app.on('will-quit', async () => {
  const state = timer.getState()
  if (state === 'STARTED') await timer.stop(false);
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
    win.webContents.send('action', {
      type: 'STOP',
    })
  }

  const handleStarted = () => {
    win.webContents.send('action', {
      type: 'START',
    })
  }

  const handleTick = (until: number) => {
    win.webContents.send('action', {
      type: 'TICK',
      payload: {
        until
      }
    })
  }

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })


  // todo: clean this up on window destroy.
  ipcMain.on('stop-timer', () => {
    timer.stop(false)
  })

  ipcMain.on('start-timer', async () => {
    const config = await readConfig()
    const plugins = loadPlugins(config)
    const timerState = timer.getState()
    timer = new Timer(config, plugins)

    // Handle actual timer events. The timer is the source of truth.
    timer.on('stopped', handleStopped)
    timer.on('tick', handleTick)
    timer.on('starting', handleStarted)

    if (timerState === 'STOPPED') await timer.start()
  })

  ipcMain.on('toggle', async () => {
    const timerState = timer.getState()

    if (timerState === 'STOPPED') return ipcMain.emit('start-timer')

    ipcMain.emit('stop-timer')
  })

  await win.loadFile('index.html');
}

async function createPreferencesWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  await win.loadFile('preferences.html');
}

let tray

app.on('ready', async () => {
  // Create our menu entries so that we can use MAC shortcuts
  const menu = Menu.buildFromTemplate([
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'close' },
    { role: 'hide' },
    { role: 'minimize' },
    { role: 'forceReload' },
    { role: 'toggleDevTools' },
    { role: 'unhide' },
    { type: 'separator' },
    { label: 'Preferences...',
      accelerator: 'CommandOrControl+,',
      registerAccelerator: true,
      click: createPreferencesWindow
    },
    { role: 'quit' },
  ])
  const appMenu = Menu.buildFromTemplate([
    {label: app.getName(), submenu: menu}
  ])
  Menu.setApplicationMenu(appMenu);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Toggle Time', accelerator: 'Command+Shift+,'},
  ])
  tray = new Tray(path.join(__dirname, '..', 'public', 'GroupTemplate.png'))
  tray.setToolTip(app.getName())
  tray.setContextMenu(contextMenu)
  globalShortcut.register('Command+Shift+,', () => ipcMain.emit('toggle'))

  await createWindow()
});
