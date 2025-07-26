import { WebSocketServer, WebSocket } from "ws";
import { handleMessage } from "./message-handler";
import type { Message, Response } from "../types/types";
import { log, error as logError } from "./logger";

let wss: WebSocketServer | null = null;
const PORT = 3939;

export function startWebSocketServer(app?: Electron.App): void {
  const port = PORT;
  try {
    wss = new WebSocketServer({ port });

    wss.on("connection", (ws: WebSocket) => {
      log("🌐 WebSocket client connected");

      ws.on("message", async (data: string | Buffer) => {
        try {
          const message: Message = JSON.parse(data.toString());
          log(`📩 Received WebSocket message: ${message.type}`);

          await handleMessage(app!, message, (response: Response) => {
            ws.send(JSON.stringify(response));
            log(`📤 Sent WebSocket response: ${response.message || "ok"}`);
          });
        } catch (err) {
          logError("❌ Failed to handle WebSocket message", err as Error);
          ws.send(
            JSON.stringify({
              success: false,
              error: (err as Error).message,
              timestamp: Date.now(),
            } satisfies Response)
          );
        }
      });

      ws.on("close", () => {
        app!.quit();
        log("🔌 WebSocket connection closed");
      });
    });

    wss.on("listening", () => {
      log(`🚀 WebSocket server started on ws://localhost:${port}`);
    });

    wss.on("error", (err) => {
      if ((err as any).code === "EADDRINUSE") {
        logError(`❌ WebSocket port ${port} is already in use.`);
        setTimeout(() => {
          logError("❌ Quitting app due to WebSocket port error");
          app!.quit();
        }, 5000);
      } else {
        logError("❌ WebSocket server error:", err as Error);
      }
    });
  } catch (err) {
    logError("❌ Failed to start WebSocket server:", err as Error);
  }
}

export function closeWebSocketServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (wss) {
      wss.close((err) => {
        if (err) reject(err);
        else {
          console.log("[WS] Server closed");
          wss = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}
