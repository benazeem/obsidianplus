import { WebSocketServer, WebSocket } from "ws";
import { handleMessage } from "./message-handler";
import type  { Message, Response } from "../../types/types";
import { log, error as logError } from "./logger";

export function startWebSocketServer(port = 3939): void {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    log("🌐 WebSocket client connected");

    ws.on("message", async (data: string | Buffer) => {
      try {
        const message: Message = JSON.parse(data.toString());
        log(`📩 Received WebSocket message: ${message.type}`);

        await handleMessage(message, (response: Response) => {
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
      log("🔌 WebSocket connection closed");
    });
  });

  log(`🚀 WebSocket server started on ws://localhost:${port}`);
}
