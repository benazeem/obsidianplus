import setNotification from '@/utils/Notification'

type MessageHandlerMap = Map<string, (response: any) => void>

export function createWebSocketService() {
  let ws: WebSocket | null = null
  let connected = false
  const url = 'ws://localhost:3939'
  const messageHandlers: MessageHandlerMap = new Map()

  function connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(url)

        ws.onopen = () => {
          connected = true
          resolve()
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            handleMessage(message)
          } catch (error) {
            setNotification(
              'Error parsing WebSocket message: ' + error,
              'error',
            )
          }
        }

        ws.onclose = () => {
          setNotification('WebSocket disconnected from host', 'info')
          connected = false
        }

        ws.onerror = (error) => {
          setNotification('WebSocket error: ' + error, 'error')
          connected = false
          setNotification(
            'WebSocket connection failed. Please ensure the host is running.',
            'error',
          )
          reject()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  function disconnect(): void {
    if (ws) {
      ws.close()
      ws = null
      connected = false
    }
  }

  function isConnected(): boolean {
    return connected && ws?.readyState === WebSocket.OPEN
  }

  function sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!isConnected()) {
        setNotification('WebSocket is not connected', 'error')
        reject()
        return
      }

      const messageId = `ws_${Date.now()}_${Math.random()}`
      const messageWithId = { ...message, messageId }

      messageHandlers.set(messageId, resolve)

      ws!.send(JSON.stringify(messageWithId))

      setTimeout(
        () => {
          if (messageHandlers.has(messageId)) {
            messageHandlers.delete(messageId)
            setNotification('WebSocket message timeout', 'error')
            reject()
          }
        },
        2 * 60 * 1000,
      ) // 2 minutes timeout
    })
  }

  function handleMessage(message: any): void {
    if (message.messageId && messageHandlers.has(message.messageId)) {
      const handler = messageHandlers.get(message.messageId)!
      messageHandlers.delete(message.messageId)
      handler(message)
      return
    }
  }

  return {
    connect,
    disconnect,
    isConnected,
    sendMessage,
  }
}
