import setNotification from '@/utils/Notification'

export function createNativeMessagingService(
  hostName = 'com.obsidianplus.host',
) {
  let port: chrome.runtime.Port | null = null
  let connected = false

  const isConnected = () => connected && port !== null

  const connect = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        port = chrome.runtime.connectNative(hostName)

        port.onMessage.addListener((message) => {
          setNotification(
            'Received message from native host: ' + JSON.stringify(message),
            'info',
          )
        })

        port.onDisconnect.addListener(() => {
          setNotification('Native messaging port disconnected', 'info')
          connected = false

          if (chrome.runtime.lastError) {
            setNotification(
              'Error: ' + chrome.runtime.lastError.message,
              'error',
            )
            reject()
          }
        })

        port.postMessage({
          type: 'connection_test',
          payload: { timestamp: Date.now() },
          timestamp: Date.now(),
        })

        connected = true
        resolve()
      } catch (error) {
        setNotification('Failed to connect to native host: ' + error, 'error')
        reject(error)
      }
    })
  }

  const disconnect = () => {
    if (port) {
      port.disconnect()
      port = null
      connected = false
    }
  }

  const sendMessage = async (message: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!isConnected()) {
        setNotification('Native host is not connected', 'error')
        return reject()
      }

      const messageId = `msg_${Date.now()}_${Math.random()}`
      const messageWithId = { ...message, messageId }

      const responseHandler = (response: any) => {
        if (response.messageId === messageId || response.type === 'pong') {
          resolve(response)
        }
      }

      port!.onMessage.addListener(responseHandler)

      port!.postMessage(messageWithId)

      setTimeout(() => {
        if (port) {
          port.onMessage.removeListener(responseHandler)
        }
        setNotification(
          'No response from native host for message: ' +
            JSON.stringify(message),
          'warning',
        )
        reject()
      }, 1 * 60 * 1000)
    })
  }
  return {
    connect,
    disconnect,
    isConnected,
    sendMessage,
  }
}

export const nativeMessaging = createNativeMessagingService()
