export interface VaultInfo {
  name: string;
  path: string;
  obsidianPath: string;
  folders: FileTreeItem[];
}

export interface FileTreeItem {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: FileTreeItem[];
}

export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  hostname: string;
  uptime: number;
  memory: {
    total: number;
    free: number;
    used: number;
  };
  timestamp: number;
}

export interface PageInfo {
  title: string;
  url: string;
  domain: string;
  lastModified: string;
  referrer: string;
  tags: string[];
  cleanedHTML: string;
  timestamp: number;
}

// Base message interface
export interface BaseMessage {
  type: string;
  payload?: any;
  timestamp: number;
  messageId?: string; // ✅ Add this
}

// Specific message types
export interface PingMessage extends BaseMessage {
  type: "ping";
  payload: {
    timestamp: number;
  };
}

export interface SystemInfoMessage extends BaseMessage {
  type: "get_system_info";
  payload: {};
}

export interface CustomMessage extends BaseMessage {
  type: "custom_message";
  payload: any;
}

export interface ScanVaultsMessage extends BaseMessage {
  type: "scanObsidianVaults";
  payload: {
    vaultRoot: string[]; // Optional vault root paths
  };
}

export interface SaveFileMessage extends BaseMessage {
  type: "saveMarkdownFile";
  payload: {
    content: string;
    path: string;
  };
}

export interface PageCommandMessage extends BaseMessage {
  type: "page_command";
  payload: {
    command: string;
    data?: any;
  };
}

export interface ShutdownMessage extends BaseMessage {
  type: "shutdown";
  payload: {};
}

export interface LaunchMessage extends BaseMessage {
  type: "launch";
  payload: {};
}

export type Message =
  | PingMessage
  | SystemInfoMessage
  | CustomMessage
  | ScanVaultsMessage
  | SaveFileMessage
  | PageCommandMessage
  | ShutdownMessage
  | LaunchMessage;

export interface Response {
  messageId?: string; // Optional for responses to allow tracking
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  timestamp: number;
}

export interface SaveFileResult {
  success: boolean;
  message: string;
}

export type MessageCallback = (response: Response) => void;
