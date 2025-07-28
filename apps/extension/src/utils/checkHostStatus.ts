import setNotification from './Notification'

export async function checkHostStatus() {
  try {
    interface HostPingResponse {
      success: boolean
      message?: string
      [key: string]: unknown
    }

    const response = await new Promise<HostPingResponse>((resolve, reject) => {
      setNotification('Ping: Checking host status...', 'info')
      chrome.runtime.sendMessage(
        { type: 'PING_HOST' },
        (response: HostPingResponse) => {
          if (chrome.runtime.lastError) {
            setNotification(
              '❌ Could not ping host: ' + chrome.runtime.lastError.message,
              'error',
            ) 
            reject()
            return {
              success: false,
              error: 'Host is not connected: Click on Monitor icon to retry',
            }
          }
          resolve(response)
        },
      )
    })
    return response
  } catch (err) {
    setNotification('Unexpected error in checking host status: ' + err, 'error')
    return {
      success: false,
      error: 'Host is not connected: Click on Monitor icon to retry',
    }
  }
}
