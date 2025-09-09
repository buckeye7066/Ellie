import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ellie', {
  send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  on: (channel: string, cb: (...args: any[]) => void) =>
    ipcRenderer.on(channel, (_e, ...args) => cb(...args)),
  invoke: (channel: string, data?: any) => ipcRenderer.invoke(channel, data),
});


