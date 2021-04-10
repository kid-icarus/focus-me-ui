import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  startTimer: () => ipcRenderer.invoke('start-timer'),
  stopTimer: () => ipcRenderer.invoke('stop-timer'),
  readConfig: () => ipcRenderer.invoke('stop-timer'),
  writeConfig: () => ipcRenderer.invoke('stop-timer'),
})
