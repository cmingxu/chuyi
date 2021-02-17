const { app, BrowserWindow, screen } = require("electron");
const path = require('path');
const config = require("./config");

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let win = null;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({ width, height });

  win = new BrowserWindow({
    width: width,
    height: height,
    title: config.defaultTitle,
    // enableRemoteModule: true,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      devTools: true,
      enableRemoteModule: true,
      partition: 'persist:chuyi',
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  win.on('will-attach-webview', () => {
    console.log('will-attach-webview');
  });
  win.loadURL("https://fxg.jinritemai.com/");
  // win.loadURL("https://www.baidu.com/");
  // win.loadFile(path.join(app.getAppPath(), "index.html"));
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
