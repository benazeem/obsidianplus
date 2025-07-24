import { app } from "electron";
import { startNativeHost } from "../src/index";

app.commandLine.appendSwitch("disable-gpu");

app.whenReady().then(() => {
  console.log("[Electron] App ready - running native logic without UI");
  startNativeHost();
});
