export default function setNotification(
  message: string,
  type: 'info' | 'error' | 'warning',
): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.log('%cNo active tab found', 'color: red')
        resolve()
        return
      }
      const tabId = tabs[0]?.id
      if (!tabId) {
        console.log('%cNo active tab found', 'color: red')
        resolve()
        return
      }
      if (tabs[0].url?.includes('chrome://')) {
        console.log(
          '%cCannot send notification to chrome:// pages',
          'color: red',
        )
        resolve()
        return
      }
      if (tabs[0].url?.includes('chrome-extension://')) {
        console.log(
          '%cCannot send notification to chrome-extension:// pages',
          'color: red',
        )
        resolve()
        return
      }
      if (tabs[0].url?.includes('file://')) {
        console.log('%cCannot send notification to file:// pages', 'color: red')
        resolve()
        return
      }
      if (!tabs[0].url) {
        console.log('%cNo URL found for the active tab', 'color: red')
        resolve()
        return
      }
      try {
        chrome.tabs.sendMessage(
          tabId,
          { type: 'SHOW_NOTIFICATION', payload: { message, type } },
          (response) => {
            if (chrome.runtime.lastError) {
              console.log(
                '%cRuntime error: ' + chrome.runtime.lastError.message,
                'color: red',
              )
              resolve()
              return
            }
            if (response?.success) {
              console.log('Notification sent successfully')
            } else {
              console.log(
                '%c❌ Failed to show notification:',
                response?.error,
                'color: yellow',
              )
            }
            resolve()
          },
        )
      } catch (err) {
        console.log(
          '%cUnexpected error in sending notification:',
          err,
          'color: red',
        )
        resolve()
      }
    })
  })
}
