import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('ellie', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, cb) => ipcRenderer.on(channel, (_e, ...args) => cb(...args)),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
});
