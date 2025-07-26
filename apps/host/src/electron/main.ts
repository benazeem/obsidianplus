// main.ts
import { app } from "electron";
import { startWebSocketServer } from "../services/websocket-server";

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");
app.commandLine.appendSwitch("disable-dev-shm-usage");
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("disable-dev-tools");

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  console.log("[Electron] App is ready.");
  startWebSocketServer(app);
});
