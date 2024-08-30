const { app, BrowserWindow } = require('electron/main');
const serve = require('electron-serve');
const path = require('node:path');

if (require('electron-squirrel-startup')) app.quit();

const loadURL = serve({ directory: 'build' });

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      width: 800,
      height: 600,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (app.isPackaged) {
    loadURL(win);
  } else {
    win.loadURL('http://localhost:3000/');
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
