const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const { pathToFileURL } = require('url');

ipcMain.handle('list-dir', async (event, dir) => {
  const pageUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;
  if (!event.senderFrame || event.senderFrame.parent || event.senderFrame.url !== pageUrl) {
    throw new Error('Недопустимый источник IPC-запроса.');
  }
  if (typeof dir !== 'string' || dir.trim().length === 0) {
    throw new Error('Путь к каталогу должен быть непустой строкой.');
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.map(entry => ({
    name: entry.name,
    isDir: entry.isDirectory()
  }));
});

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
