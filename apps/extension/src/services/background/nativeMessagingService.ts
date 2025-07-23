export function createNativeMessagingService(
  hostName = "com.obsidianplus.host"
) {
  let port: chrome.runtime.Port | null = null;
  let connected = false;

  const isConnected = () => connected && port !== null;

  const connect = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        port = chrome.runtime.connectNative(hostName);

        port.onMessage.addListener((message) => {
          console.log("Received from native host:", message);
        });

        port.onDisconnect.addListener(() => {
          // console.log("Native messaging disconnected");
          connected = false;

          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          }
        });

        port.postMessage({
          type: "connection_test",
          payload: { timestamp: Date.now() },
          timestamp: Date.now(),
        });

        connected = true;
        resolve();
      } catch (error) {
        console.error("Failed to connect to native host:", error);
        reject(error);
      }
    });
  };

  const disconnect = () => {
    if (port) {
      port.disconnect();
      port = null;
      connected = false;
    }
  };

  const sendMessage = async (message: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!isConnected()) {
        return reject(new Error("Not connected to native host"));
      }

      const messageId = `msg_${Date.now()}_${Math.random()}`;
      const messageWithId = { ...message, messageId };

      const responseHandler = (response: any) => {
        if (response.messageId === messageId || response.type === "pong") {
          resolve(response);
        }
      };

      port!.onMessage.addListener(responseHandler);

      port!.postMessage(messageWithId);

      setTimeout(() => {
        if (port) {
          port.onMessage.removeListener(responseHandler);
        }
        reject(new Error("Message timeout"));
      }, 10000);
    });
  };
  return {
    connect,
    disconnect,
    isConnected,
    sendMessage,
  };
}

export const nativeMessaging = createNativeMessagingService();
