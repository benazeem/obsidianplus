import {
  type BackgroundContext,
  launchAndConnectToHost,
} from "./backgroundService"; 
import { getErrorMessage } from "./utils";

type ExtensionMessage =
  | { type: "LAUNCH_HOST" }
  | { type: "CHECK_HOST_STATUS" }
  | { type: "PING_HOST" }
  | { type: "GET_HOST_INFO" }
  | { type: "SEND_TO_HOST"; payload: any }
  | { type: "SCAN_VAULTS"; payload: { vaultRoot: string[] } }
  | { type: "SAVE_OBSIDIAN_FILE"; payload: any };

export async function handleMessage(
  ctx: BackgroundContext,
  message: ExtensionMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): Promise<void> {
  if (
    !ctx.hostLaunched &&
    !ctx.webSocket.isConnected()
  ) {
    try {
      await launchAndConnectToHost(ctx);
    } catch (error) {
      sendResponse({
        success: false,
        error:
          "Host not available. Please ensure the native host is installed and running.",
      });
      return;
    }
  }
 
  try {
    let response;

    switch (message.type) {
      case "LAUNCH_HOST": 
         await launchAndConnectToHost(ctx);
        response = { success: true, message: "Host launched" }; 
        break;

      case "CHECK_HOST_STATUS":
        response = await checkHostStatus(ctx);
        break;

      case "PING_HOST":
        response = await pingHost(ctx);
        break;

      case "GET_HOST_INFO":
        response = await getHostInfo(ctx);
        break;

      case "SEND_TO_HOST":
        response = await sendToHost(ctx, { payload: message.payload });
        break;

      case "SCAN_VAULTS":
        response = await scanVaults(ctx, {
          vaultRoot: message.payload.vaultRoot,
        });
        break;

      case "SAVE_OBSIDIAN_FILE":
        response = await saveMarkdown(ctx, { content: message.payload.content, path: message.payload.path });
        break;

      default:
        response = { success: false, error: "Unknown message type" };
    }

    sendResponse(response);
  } catch (error) {
    console.error("[Background] Error handling message:", error);
    sendResponse({ success: false, error: getErrorMessage(error) });
  }
}

async function checkHostStatus(ctx: BackgroundContext) {

    const hostLaunched =  ctx.hostLaunched; 
    const websocketConnected = ctx.webSocket.isConnected();
    const timestamp = Date.now();
    const success = hostLaunched;
    const connectionType = websocketConnected? "WebSocket" : "Unknown"; 
  return { success, connectionType, timestamp };
}

async function pingHost(ctx: BackgroundContext) {
  const msg = { type: "ping", payload: {}, timestamp: Date.now() };
  if (ctx.webSocket.isConnected()) return ctx.webSocket.sendMessage(msg); 
  throw new Error("No connection to host");
}

async function getHostInfo(ctx: BackgroundContext) {
  const msg = { type: "get_system_info", payload: {}, timestamp: Date.now() };
  if (ctx.webSocket.isConnected()) return ctx.webSocket.sendMessage(msg); 
  throw new Error("No connection to host");
}

async function sendToHost(ctx: BackgroundContext, payload: any) {
  const msg = { type: "custom_message", payload, timestamp: Date.now() };
  if (ctx.webSocket.isConnected()) return ctx.webSocket.sendMessage(msg); 
  throw new Error("No connection to host");
}

async function scanVaults(
  ctx: BackgroundContext,
  payload: { vaultRoot: string[] }
) {
  const msg = { type: "scanObsidianVaults", payload, timestamp: Date.now() }; 
  if (ctx.webSocket.isConnected()) return await ctx.webSocket.sendMessage(msg);
  throw new Error("No connection to host");
}

async function saveMarkdown(ctx: BackgroundContext, payload: any) { 
  const msg = { type: "saveMarkdownFile", payload, timestamp: Date.now() };
  if (ctx.webSocket.isConnected()) return ctx.webSocket.sendMessage(msg); 
  throw new Error("No connection to host");
}
