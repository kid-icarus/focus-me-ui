import {app, ipcMain, BrowserWindow} from 'electron'
import path from 'path'

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

app.on('ready', createWindow);
