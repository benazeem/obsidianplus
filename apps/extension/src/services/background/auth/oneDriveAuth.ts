import axios from "axios";

const SCOPES = [
  "openid",
  "profile",
  "email",
  "User.Read",
  "Files.Read",
  "Files.ReadWrite",
  "Files.ReadWrite.All",
].join(" ");

let accessToken: string | null = null;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/onedrive-auth`;
const CLIENT_ID = import.meta.env.VITE_ONEDRIVE_CLIENT_ID;
const TENANT_ID = "common";
const AUTH_ENDPOINT = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`;

export async function initializeOneDriveAuth(): Promise<boolean> {
  const token = await silentAuth();
  if (token && (await validateToken(token))) {
    accessToken = token;
    return true;
  }
  return false;
}

export async function authenticate() {
  if (accessToken && (await validateToken(accessToken))) {
    return { success: true, token: accessToken };
  }

  try {
    const silentToken = await silentAuth();
    if (silentToken && (await validateToken(silentToken))) {
      accessToken = silentToken;
      return { success: true, token: silentToken };
    }

    const interactiveToken = await interactiveAuth();
    if (interactiveToken && (await validateToken(interactiveToken))) {
      accessToken = interactiveToken;
      return { success: true, token: interactiveToken };
    }

    return { success: false, error: "Authentication failed" };
  } catch (error) {
    console.error("OneDrive connection error:", error);
    return { success: false, error: String(error) };
  }
}

async function silentAuth(): Promise<string | null> {
  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_mode=fragment&prompt=none`;
 
  return new Promise((resolve) => {
    chrome.identity.launchWebAuthFlow(
      { url, abortOnLoadForNonInteractive: false, interactive: false },
      (responseUrl) => { 
        if (!responseUrl || chrome.runtime.lastError) return resolve(null);

        const token = extractTokenFromUrl(responseUrl); 
        if (token) setAutoExpire();
        resolve(token);
      }
    );
  });
}

async function interactiveAuth(): Promise<string | null> {
  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_mode=fragment&prompt=login`;

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      { url, interactive: true },
      (responseUrl) => { 
        if (!responseUrl || chrome.runtime.lastError)
          return reject(chrome.runtime.lastError);

        const token = extractTokenFromUrl(responseUrl);
        if (token) setAutoExpire();
        resolve(token);
      }
    );
  });
}

function extractTokenFromUrl(url: string): string | null {
  const fragment = new URL(url).hash.substring(1);
  const params = new URLSearchParams(fragment);
  return params.get("access_token");
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}

export async function getValidToken(): Promise<string | null> {
  if (accessToken && (await validateToken(accessToken))) return accessToken;

  const result = await authenticate();
  return result.success && typeof result.token === "string"
    ? result.token
    : null;
}

export async function revokeAuth(): Promise<void> {
  const logoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  try { 
    chrome.identity.launchWebAuthFlow(
      {
        url: logoutUrl,
        interactive: true,
      },
      () => {
        accessToken = null;
        if (refreshTimeout) clearTimeout(refreshTimeout); 
      }
    ); 
  } catch (error) {
    console.error("Error during OneDrive logout:", error);
  }
}

function setAutoExpire() {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(
    () => {
      accessToken = null;
    },
    55 * 60 * 1000
  ); // 55 minutes
}

export async function refreshConnection(): Promise<string | null> {
  accessToken = null;
  if (refreshTimeout) clearTimeout(refreshTimeout);

  const token = await silentAuth();
  if (token && (await validateToken(token))) {
    accessToken = token;
    return token;
  }

  try {
    const interactiveToken = await interactiveAuth();
    if (interactiveToken && (await validateToken(interactiveToken))) {
      accessToken = interactiveToken;
      return interactiveToken;
    }
  } catch (error) {
    console.error("refreshConnection interactive fallback failed:", error);
  }

  return null;
}
