const { app, BrowserWindow, screen } = require("electron");
const path = require('path');
const config = require("./src/js/config");

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let win = null;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({ width, height });

  win = new BrowserWindow({
    width: width,
    height: height,
    title: config.defaultTitle,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      devTools: true,
      enableRemoteModule: true,
      partition: 'persist:chuyi',
      preload: path.join(__dirname, "./dist/preload.js"),
    },
  });

  win.on('will-attach-webview', () => {
  });
  win.loadURL("https://fxg.jinritemai.com/");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
