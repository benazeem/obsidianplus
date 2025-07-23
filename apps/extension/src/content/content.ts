import type { PageInfo } from "@/types";
 

const extensionId = chrome.runtime.id;

function initialize(): void { 
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender, sendResponse);
    return true; // Keep the message channel open
  }); 
}

function handleMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): void { 
  console.log("Sender:", sender, extensionId);

  switch (message.type) {
    case "PING":
      sendResponse({ success: true });
      break;

    case "HOST_MESSAGE":
      handleHostMessage(message.payload);
      sendResponse({ success: true });
      break;

    case "GET_PAGE_INFO":
      sendResponse({ success: true, data: getPageInfo() });
      break;

    case "SHOW_NOTIFICATION":
      showNotification(message.payload);
      sendResponse({ success: true });
      break;  

    default:
      sendResponse({ success: false, error: "Unknown message type" });
  }
}

function handleHostMessage(payload: any): void {
  

  if (payload.type === "page_command") {
    executePageCommand(payload.command);
  }
}

function executePageCommand(command: string): void {
  switch (command) { 
    case "count_elements":
      showElementCount();
      break;
    default:
      // console.log("Unknown page command:", command);
  }
}

 
function showElementCount(): void {
  const counts = {
    links: document.querySelectorAll("a").length,
    images: document.querySelectorAll("img").length,
    forms: document.querySelectorAll("form").length,
    inputs: document.querySelectorAll("input").length,
  };

  const message = `Page elements: ${Object.entries(counts)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")}`;

  showNotification(message);
}

function getPageInfo(): PageInfo {
  const clonedBody = document.body.cloneNode(true) as HTMLElement;
  const tagsSet = new Set<string>(); 

  const descriptionRaw = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");
  const description = descriptionRaw === null ? undefined : descriptionRaw;

  const hashtagMatches = clonedBody.textContent?.match(/#[a-zA-Z0-9_-]+/g);
  if (hashtagMatches) {
    hashtagMatches.forEach((tag) => tagsSet.add(tag.slice(1).toLowerCase()));
  }

  const keywords = document
    .querySelector('meta[name="keywords"]')
    ?.getAttribute("content");
  if (keywords) {
    keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .forEach((tag) => tagsSet.add(tag));
  }

  // Filter out tags that look like meaningless hex color codes or numbers
  const uniqueTags = Array.from(tagsSet).filter((tag) => {
    // Remove tags that are all hex digits and length 3-6 (likely color codes)
    if (/^(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/i.test(tag)) return false;
    // Remove tags that are only numbers
    if (/^\d+$/.test(tag)) return false;
    // Remove tags that are hex color codes with length 3 or 6 (e.g. "d33", "085", "ccf", "ddf")
    if (/^[a-fA-F0-9]{3}$/.test(tag) || /^[a-fA-F0-9]{6}$/.test(tag)) return false;
    return true;
  });

  return {
    title: document.title,
    url: window.location.href,
    domain: window.location.hostname,
    lastModified: document.lastModified,
    referrer: document.referrer,
    description,
    tags: uniqueTags,
    html: clonedBody.innerHTML,
    timestamp: Date.now(),
  };
}
 

function showNotification(message: string): void {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 50px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;

  console.log("Showing notification:", message);

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

// Initialize content script
initialize();
