import {
  app,
  ipcMain,
  Menu,
  Tray,
  globalShortcut,
  BrowserWindow,
  nativeTheme,
} from 'electron'
import { Timer } from '@focus-me/focus-cli/dist/timer'
import { loadPlugins } from '@focus-me/focus-cli/dist/util/load-plugins'
import * as path from 'path'
import { readConfig, writeConfig } from './util/config'
import got from 'got'

let timer: Timer
void (async (): Promise<void> => {
  try {
    const config = await readConfig()
    const plugins = loadPlugins(config)
    timer = new Timer(config, plugins)
  } catch (e) {
    console.error(e)
  }
})()

nativeTheme.themeSource = 'system'

app.on('will-quit', () => {
  const state = timer.getState()
  if (state === 'STARTED') timer.stop(false).catch((e) => console.error(e))
})

app.dock.setIcon(path.join(__dirname, '..', 'public', 'Enso.png'))

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
  })

  const handleStopping = () => {
    win.webContents.send('action', {
      type: 'STOPPING',
    })
  }

  const handleStopped = () => {
    win.webContents.send('action', {
      type: 'STOPPED',
    })
  }

  const handleStarted = (until: number) => {
    win.webContents.send('action', {
      type: 'START',
      payload: {
        until,
      },
    })
  }

  const handleTick = (until: number) => {
    win.webContents.send('action', {
      type: 'TICK',
      payload: {
        until,
      },
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
    timer.stop(false).catch((e) => console.error(e))
  })

  ipcMain.on('start-timer', () => {
    readConfig()
      .then((config) => {
        const plugins = loadPlugins(config)
        const timerState = timer.getState()
        timer = new Timer(config, plugins)
        timer.on('stopping', handleStopping)
        timer.on('stopped', handleStopped)
        timer.on('tick', handleTick)
        timer.on('started', handleStarted)

        if (timerState === 'STOPPED')
          timer.start().catch((e) => console.error(e))
      })
      .catch((e) => console.error(e))

    // Handle actual timer events. The timer is the source of truth.
  })

  ipcMain.on('toggle', () => {
    const timerState = timer.getState()

    if (timerState === 'STOPPED') return ipcMain.emit('start-timer')

    ipcMain.emit('stop-timer')
  })

  ipcMain.on('open-slack-auth', () => {
    void createAuthWindow()
  })

  await win.loadFile('index.html')
}

async function createPreferencesWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
  })

  await win.loadFile('preferences.html')
}

const createAuthWindow = async () => {
  const config = await readConfig()
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  })
  const params = new URLSearchParams({
    client_id: config.plugins.slack.client_id,
    user_scope: 'users.profile:write,dnd:write',
  })
  const url = new URL('https://slack.com/oauth/v2/authorize')
  url.search = params.toString()

  await win.loadURL(url.toString()).catch(console.error)

  const {
    session: { webRequest },
  } = win.webContents

  const filter = {
    urls: [`${config.plugins.slack.redirect_uri}/*`],
  }

  webRequest.onBeforeRequest(filter, ({ url }) => {
    console.log({ url })
    const params = new URL(url).searchParams
    void got
      .post('https://slack.com/api/oauth.v2.access', {
        form: {
          client_id: config.plugins.slack.client_id,
          client_secret: config.plugins.slack.client_secret,
          code: params.get('code'),
          redirect_uri: config.plugins.slack.redirect_uri,
        },
      })
      .json<{ authed_user: { access_token: string } }>()
      .then(async (x) => {
        config.plugins.slack.token = x.authed_user.access_token
        await writeConfig(config)
        win.close()
      })
  })
}

let tray: Tray

app.on('ready', () => {
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
    {
      label: 'Preferences...',
      accelerator: 'CommandOrControl+,',
      registerAccelerator: true,
      click: createPreferencesWindow,
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    { role: 'quit' },
  ])
  const appMenu = Menu.buildFromTemplate([
    { label: app.getName(), submenu: menu },
  ])
  Menu.setApplicationMenu(appMenu)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Toggle Time', accelerator: 'Command+Shift+,' },
  ])
  tray = new Tray(path.join(__dirname, '..', 'public', 'GroupTemplate.png'))
  tray.setToolTip(app.getName())
  tray.setContextMenu(contextMenu)
  globalShortcut.register('Command+Shift+,', () => ipcMain.emit('toggle'))

  createWindow().catch((e) => console.error(e))
})
