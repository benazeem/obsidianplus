import { startWebSocketServer } from "./services/websocket-server"; 

export function startNativeHost() {
  console.log("[ObsidianHost] Starting native host...");
  startWebSocketServer();
}