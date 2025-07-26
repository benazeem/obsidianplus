export async function checkHostStatus() {
  try {
    interface HostPingResponse {
      success: boolean
      message?: string
      [key: string]: unknown
    }

    const response = await new Promise<HostPingResponse>((resolve, reject) => {
      console.log('Ping: Checking host status...')
      chrome.runtime.sendMessage(
        { type: 'PING_HOST' },
        (response: HostPingResponse) => {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError?.message)
            reject(new Error('Host is not connected'))
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
    console.error('Unexpected error in hostStatusCheck:', err)
    return {
      success: false,
      error: 'Host is not connected: Click on Monitor icon to retry',
    }
  }
}
