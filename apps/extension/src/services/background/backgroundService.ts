import { handleMessage } from "./message-handler";
import { createWebSocketService } from "./websocketService";

export interface BackgroundContext {
  webSocket: ReturnType<typeof createWebSocketService>;
  hostLaunched: boolean;
}

const ctx: BackgroundContext = {
  webSocket: createWebSocketService(),
  hostLaunched: false,
};

export function initBackgroundService(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(ctx, message, sender, sendResponse);
    return true;
  });

  chrome.runtime.onStartup.addListener(() => {
    console.log("Extension started");
    launchAndConnectToHost(ctx);
  });

  chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    window.open("https://obsidianplus.devazeem.me/install", "_blank");
    launchAndConnectToHost(ctx);
    chrome.runtime.sendMessage({
      type: "LAUNCH_HOST",
      payload: {},
    });
  });
}

export async function launchAndConnectToHost(
  ctx: BackgroundContext
): Promise<void> {
  try {
    startNativeHost();
    await connectViaWebSocket(ctx);
  } catch (error) {
    console.warn("WebSocket failed", error);
  }
}

async function connectViaWebSocket(ctx: BackgroundContext): Promise<void> {
  await ctx.webSocket
    .connect()
    .then(() => {
      // console.log("WebSocket connected to host");
    })
    .catch(() => {
      // console.error("WebSocket connection failed:", error);
    });
  ctx.hostLaunched = true;
}

let port: chrome.runtime.Port | null = null;
export function startNativeHost() {
  port = chrome.runtime.connectNative("com.obsidianplus.host");
  // console.log("Native messaging port initialized:");

  port.onDisconnect.addListener(() => {
    // console.log("Native messaging port disconnected");
    port = null;
    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message);
    }
  });

  port.onMessage.addListener((message) => {
    console.log("Received message from native host:", message);
  });
}

export function startServices() {
  launchAndConnectToHost(ctx);
}
