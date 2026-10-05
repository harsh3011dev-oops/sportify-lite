const { app, BrowserWindow } = require('electron');
const path = require('path');

// Start the backend server
require('./backend/server.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: "Sportify Lite",
    icon: path.join(__dirname, 'ui/favicon.ico'),
    autoHideMenuBar: true
  });

  // Give the backend a small moment to start up, then load the UI
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 1000);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
