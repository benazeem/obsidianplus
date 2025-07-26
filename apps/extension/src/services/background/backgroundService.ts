import { handleMessage } from './message-handler'
import type { createNativeMessagingService } from './nativeMessagingService'
import { createWebSocketService } from './websocketService'

export interface BackgroundContext {
  webSocket: ReturnType<typeof createWebSocketService>
  nativeMessaging?: ReturnType<typeof createNativeMessagingService>
  hostLaunched: boolean
}

const ctx: BackgroundContext = {
  webSocket: createWebSocketService(),
  hostLaunched: false,
}

export function initBackgroundService(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(ctx, message, sender, sendResponse)
    return true
  })

  chrome.runtime.onStartup.addListener(() => {
    console.log('Extension started')
    launchAndConnectToHost(ctx)
  })

  chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed')
    chrome.tabs.create({ url: 'https://obsidianplus.devazeem.me/install' })
    launchAndConnectToHost(ctx)
  })

  chrome.runtime.onSuspend.addListener(() => {
    console.log('Extension suspended')
  })

  chrome.runtime.onUpdateAvailable.addListener(() => {
    console.log('Extension update available')
    // chrome.tabs.create({ url: 'https://obsidianplus.devazeem.me/updates' })
  })
}

export async function launchAndConnectToHost(
  ctx: BackgroundContext,
): Promise<void> {
  if (ctx.webSocket.isConnected()) {
    console.log('Host already launched and connected.')
    return
  }

  try {
    startNativeHost()
    await connectViaWebSocket(ctx)
  } catch (error) {
    console.warn('WebSocket failed', error)
  }
}

async function connectViaWebSocket(ctx: BackgroundContext): Promise<void> {
  await ctx.webSocket
    .connect()
    .then(() => {})
    .catch(() => {})
  ctx.hostLaunched = true
}

let port: chrome.runtime.Port | null = null
export function startNativeHost() {
  port = chrome.runtime.connectNative('com.obsidianplus.host')
  ctx.hostLaunched = true
  // console.log("Native messaging port initialized:");

  port.onDisconnect.addListener(() => {
    // console.log("Native messaging port disconnected");
    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message)
    }
    port = null
  })

  port.onMessage.addListener((message) => {
    console.log('Received message from native host:', message)
  })
}
