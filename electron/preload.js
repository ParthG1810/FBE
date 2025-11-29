const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Expose safe IPC methods here
  send: (channel, data) => {
    // Whitelist channels if necessary
    ipcRenderer.send(channel, data);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});