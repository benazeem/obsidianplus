// auth/googleAuth.ts
import axios from "axios";

let accessToken: string | null = null;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export async function initializeGDAuth() {
  const token = await new Promise<string | null>((resolve) => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (chrome.runtime.lastError || !token || typeof token !== "string")
        resolve(null);
      else resolve(token);
    });
  });

  if (token && (await validateToken(token))) {
    accessToken = token;
    return true;
  }
  return false;
}

export async function authenticate(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token || typeof token !== "string") {
        return reject(chrome.runtime.lastError);
      }

      chrome.identity.removeCachedAuthToken({ token }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        chrome.identity.getAuthToken(
          {
            interactive: true,
            scopes: [
              "https://www.googleapis.com/auth/drive",
              "https://www.googleapis.com/auth/drive.file",
              "https://www.googleapis.com/auth/userinfo.profile",
              "https://www.googleapis.com/auth/userinfo.email",
              "openid",
            ],
          },
          (newToken) => {
            if (
              chrome.runtime.lastError ||
              !newToken ||
              typeof newToken !== "string"
            ) {
              return reject(chrome.runtime.lastError);
            }

            accessToken = newToken;

            // Optional: setup expiry auto-clear
            if (refreshTimeout) clearTimeout(refreshTimeout);
            refreshTimeout = setTimeout(
              () => {
                accessToken = null;
              },
              12 * 60 * 60 * 1000
            ); // 12 hours

            resolve(newToken);
          }
        );
      });
    });
  });
}

export async function getValidToken(): Promise<string | null> {
  if (accessToken && (await validateToken(accessToken))) return accessToken;

  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token || typeof token !== "string")
        reject(chrome.runtime.lastError);
      else {
        accessToken = token;

        resolve(token);
      }
    });
  });
}

export async function revokeAuth() {
  if (!accessToken) return;
  const tokenToRevoke = accessToken;
  try {
    await axios(
      `https://accounts.google.com/o/oauth2/revoke?token=${tokenToRevoke}`
    );
    await new Promise<void>((resolve, reject) => {
      chrome.identity.removeCachedAuthToken({ token: tokenToRevoke }, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
      chrome.identity.clearAllCachedAuthTokens(() => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
      });
    });
  } catch (error) {
    console.error("Error during revocation:", error);
  } finally {
    accessToken = null;
  }
}

export function refreshConnection(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token)
        return reject(chrome.runtime.lastError);
      const tokenStr = typeof token === "string" ? token : token?.token || "";
      chrome.identity.removeCachedAuthToken({ token: tokenStr }, () => {
        chrome.identity.getAuthToken({ interactive: true }, (newToken) => {
          if (
            chrome.runtime.lastError ||
            !newToken ||
            typeof newToken !== "string"
          )
            return reject(chrome.runtime.lastError);
          resolve(newToken);
        });
      });
    });
  });
}

async function validateToken(token: string): Promise<boolean> {
  return token.startsWith("ya29.") && token.length > 100;
}
