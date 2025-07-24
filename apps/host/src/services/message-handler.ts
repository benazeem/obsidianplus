import type  { Message, Response, MessageCallback } from "../../types/types";
import { log, warn, error as logError } from "./logger";
import { getSystemInfo } from "./system-info";
import { scanObsidianVaults } from "./vault-scanner";
import { saveMarkdownFile } from "./file-manager";
import { startWebSocketServer } from "./websocket-server";

export async function handleMessage(
  message: Message,
  callback: MessageCallback
): Promise<void> {
  try {
    log(`Handling message: ${message.type}`);

    const response: Response = {
      messageId: message.messageId ?? "",
      success: false,
      timestamp: Date.now(),
    };

    switch (message.type) {
      case "launch":
        response.success = true;
        response.data = { startedAt: Date.now() };
        startWebSocketServer();
        break;

      case "ping":
        response.success = true;
        response.message = "pong";
        response.data = {
          receivedTimestamp: message.payload?.timestamp,
          responseTimestamp: Date.now(),
        };
        break;

      case "get_system_info":
        response.success = true;
        response.data = getSystemInfo();
        break;

      case "scanObsidianVaults":
        if (!message.payload?.vaultRoot) {
          response.error = "Missing vault root in payload";
          break;
        }

        const rootPaths = message.payload.vaultRoot;
        const vaults = await scanObsidianVaults(rootPaths);

        if (vaults.length === 0) {
          response.error = "No Obsidian vaults found in the provided paths";
          break;
        }

        response.success = true;
        response.data = vaults;
        break;

      case "saveMarkdownFile":
        if (!message.payload?.content || !message.payload?.path) {
          response.error = "Missing content or path in payload";
          break;
        }

        const saveResult = await saveMarkdownFile(
          message.payload.content,
          message.payload.path, 
        );

        response.success = saveResult.success;
        response.message = saveResult.message;
        break;

      case "custom_message":
        response.success = true;
        response.message = "Custom message received";
        response.data = {
          receivedPayload: message.payload,
          processedAt: Date.now(),
        };
        break;

      case "page_command":
        response.success = true;
        response.message = "Page command processed";
        response.data = {
          command: message.payload?.command,
          executedAt: Date.now(),
        };
        break;

      case "shutdown":
        log("🛑 Shutdown command received");
        response.success = true;
        response.message = "Shutting down host service";
        response.data = {
          shutdownAt: Date.now(),
        };
        setTimeout(() => process.exit(0), 5000);
        break;

      default:
        response.error = `Unknown message type: ${(message as Message).type}`;
        warn(response.error);
    }

    callback(response);
  } catch (error) {
    logError(
      `Error handling message: ${(error as Error).message}`,
      error as Error
    );

    const errorResponse: Response = {
      success: false,
      error: (error as Error).message,
      timestamp: Date.now(),
    };

    callback(errorResponse);
  }
}
