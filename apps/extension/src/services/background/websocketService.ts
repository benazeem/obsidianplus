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
            console.error('Error parsing WebSocket message:', error)
          }
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected from host')
          connected = false
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          connected = false
          reject(new Error('WebSocket connection failed'))
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
        reject(new Error('WebSocket not connected'))
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
            reject(new Error('WebSocket message timeout'))
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
