import setNotification from '@/utils/Notification'
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
    setNotification('Extension started', 'info')
    launchAndConnectToHost(ctx)
  })

  chrome.runtime.onInstalled.addListener(() => {
    setNotification('Extension installed', 'info')
    chrome.tabs.create({ url: 'https://obsidianplus.devazeem.me/install' })
    launchAndConnectToHost(ctx)
  })

  chrome.runtime.onSuspend.addListener(() => {
    setNotification('Extension suspended', 'info')
  })

  chrome.runtime.onUpdateAvailable.addListener(() => {
    setNotification('Extension update available', 'info')
    // chrome.tabs.create({ url: 'https://obsidianplus.devazeem.me/updates' })
  })
}

export async function launchAndConnectToHost(
  ctx: BackgroundContext,
): Promise<void> {
  if (ctx.webSocket.isConnected()) {
    setNotification('Host already launched and connected.', 'info')
    return
  }

  try {
    startNativeHost()
    await connectViaWebSocket(ctx)
  } catch (error) {
    setNotification('Failed to connect to host: ' + error, 'warning')
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
  setNotification('Native messaging host connected', 'info')

  port.onDisconnect.addListener(() => {
    setNotification('Native messaging port disconnected', 'info')
    if (chrome.runtime.lastError) {
      setNotification(
        'Error: ' + chrome.runtime.lastError.message,
        'error',
      )
    }
    port = null
  })

  port.onMessage.addListener((message) => {
    setNotification(
      'Received message from native host: ' + JSON.stringify(message),
      'info',
    )
  })
}
