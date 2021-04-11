import {app, ipcMain, Menu, Tray, globalShortcut, BrowserWindow} from 'electron'
import * as path from 'path'

ipcMain.handle('start-timer', () => {
  console.log('yosup')
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
