// services/background/auth/dropboxAuth.ts
import axios from "axios";

const DROPBOX_CLIENT_ID = import.meta.env.VITE_DROPBOX_CLIENT_ID;
const DROPBOX_CLIENT_SECRET = import.meta.env.VITE_DROPBOX_CLIENT_SECRET;
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/dropbox-auth`;

let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export async function initializeDropboxAuth(): Promise<boolean> {
  try {
    const token = await getValidDropboxToken();
    if (token && (await validateDropboxToken(token))) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to initialize Dropbox auth:", error);
    return false;
  }
}

export async function getValidDropboxToken(): Promise<string> {
  if (accessToken && (await validateDropboxToken(accessToken))) {
    return accessToken;
  }

  if (refreshToken) {
    const token = await refreshAccessToken(refreshToken);
    if (token) return token;
  }

  return authenticateDropbox();
}

/**
 * Starts interactive authentication
 */
export async function authenticateDropbox(): Promise<string> {
  const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_CLIENT_ID}&response_type=code&token_access_type=offline&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      async (responseUrl) => {
        if (!responseUrl || chrome.runtime.lastError) {
          return reject(
            chrome.runtime.lastError ||
              new Error("Dropbox authentication failed")
          );
        }

        const code = new URL(responseUrl).searchParams.get("code");
        if (!code) return reject(new Error("No code returned from Dropbox"));

        try {
          const { access_token, refresh_token, expires_in } =
            await exchangeCodeForToken(code);

          accessToken = access_token;
          refreshToken = refresh_token;

          if (refreshTimeout) clearTimeout(refreshTimeout);
          refreshTimeout = setTimeout(
            () => (accessToken = null),
            expires_in * 1000
          );

          if (accessToken) {
            resolve(accessToken);
          } else {
            reject(new Error("Failed to obtain Dropbox access token"));
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Force re-auth if refreshToken is present
 */
export async function refreshDropboxConnection(): Promise<string | null> {
  if (!refreshToken) return await authenticateDropbox();
  return await refreshAccessToken(refreshToken);
}

/**
 * Revoke and clean up Dropbox token
 */
export async function revokeDropboxAuth(): Promise<void> {
  if (!accessToken) return;

  try {
    await axios.post("https://api.dropboxapi.com/2/auth/token/revoke", null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    accessToken = null;
    refreshToken = null;
    if (refreshTimeout) clearTimeout(refreshTimeout);

    // Optional logout UI tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const currentTabId = tab?.id;

    chrome.tabs.create(
      { url: "https://www.dropbox.com/logout", active: true },
      (newTab) => {
        const newTabId = newTab.id;
        if (!newTabId) return;

        const listener = (
          updatedTabId: number,
          changeInfo: chrome.tabs.TabChangeInfo,
          updatedTab: chrome.tabs.Tab
        ) => {
          if (
            updatedTabId === newTabId &&
            changeInfo.status === "complete" &&
            updatedTab.url?.startsWith("https://www.dropbox.com/")
          ) {
            chrome.tabs.remove(newTabId);
            if (currentTabId !== undefined) {
              chrome.tabs.update(currentTabId, { active: true });
            }
            chrome.tabs.onUpdated.removeListener(listener);
          }
        };

        chrome.tabs.onUpdated.addListener(listener);
      }
    );
  } catch (error) {
    console.error("Failed to revoke Dropbox token", error);
  }
}

/**
 * Exchanges code for access & refresh token
 */
async function exchangeCodeForToken(code: string) {
  const params = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    client_id: DROPBOX_CLIENT_ID,
    client_secret: DROPBOX_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
  });

  const res = await axios.post(
    "https://api.dropboxapi.com/oauth2/token",
    params
  );
  return res.data;
}

/**
 * Refreshes Dropbox access token using stored refreshToken
 */

async function refreshAccessToken(
  refreshTokenValue: string
): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;

  refreshPromise = new Promise((resolve) => {
    (async () => {
      const params = new URLSearchParams({
        refresh_token: refreshTokenValue,
        grant_type: "refresh_token",
        client_id: DROPBOX_CLIENT_ID,
        client_secret: DROPBOX_CLIENT_SECRET,
      });

      try {
        const res = await axios.post(
          "https://api.dropboxapi.com/oauth2/token",
          params
        );
        accessToken = res.data.access_token;

        if (refreshTimeout) clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(
          () => (accessToken = null),
          res.data.expires_in * 1000
        );

        resolve(accessToken);
      } catch (err) {
        console.error("Dropbox token refresh failed:", err);
        resolve(null);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
  });

  return refreshPromise;
}

/**
 * Validates token with Dropbox API
 */
async function validateDropboxToken(token: string): Promise<boolean> {
  try {
    const res = await axios.post(
      "https://api.dropboxapi.com/2/users/get_current_account",
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.status === 200;
  } catch {
    return false;
  }
}
