const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

app.disableHardwareAcceleration();

let mainWindow;
let secondaryWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
  });
  mainWindow.loadFile("./index.html");
  mainWindow.webContents.setFrameRate(60);
}

function createSecondaryWindow() {
  secondaryWindow = new BrowserWindow({
    webPreferences: { offscreen: true },
    frame: false,
    transparent: true,
  });
  secondaryWindow.loadFile("./secondary.html");
  secondaryWindow.webContents.setFrameRate(60);
}

app.whenReady().then(() => {
  createMainWindow();
  createSecondaryWindow();

  secondaryWindow.webContents.on("paint", (event, dirty, image) => {
    fs.writeFileSync("ex.png", image.toPNG());
  });

  console.log(
    `The screenshot has been successfully saved to ${path.join(
      process.cwd(),
      "ex.png"
    )}`
  );
});

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
