export type FolderEntry = {
  name: string;
  obsidianPath?: string;
  id?: string;
  path: string;
  folders: FolderEntry[];
};

export type Folder = {
  id: string;
  name: string;
  path: string;
  folders: Folder[];
};

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture: string | null;
}

export type DropboxFile = {
  ".tag": "file";
  name: string;
  path_lower: string;
  size: number;
};

export type DropboxFolder = {
  ".tag": "folder";
  name: string;
  path_lower: string;
};

export type DropboxItem = DropboxFile | DropboxFolder;

export type ListFolderResult = {
  entries: DropboxItem[];
  cursor: string;
  has_more: boolean;
};

export type DropboxError = {
  error_summary: string;
  error: {
    ".tag": string;
  };
};

export type DropboxAuthResult = {
  success: boolean;
  token?: string;
  error?: string;
};

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[] | undefined;
}

export interface DriveData {
  connected: boolean;
  files: FileNode[];
}

export interface DriveContextType {
  drives: {
    onedrive: DriveData;
    gdrive: DriveData;
    dropbox: DriveData;
  };
  updateDrive: (
    name: keyof DriveContextType["drives"],
    data: DriveData
  ) => void;
}

export interface Vault {
  name: string;
  path: string;
  structure: FileNode[];
}

export interface ObsidianContextType {
  vaults: Vault[];
  addVault: (vault: Vault) => void;
  removeVault: (name: string) => void;
  roots: string[];
  addRoot: (root: string) => void;
  removeRoot: (root: string) => void;
}

export type Theme = "dark" | "light" | "system";
export type FontSize = "text-sm" | "text-base" | "text-lg" | "text-xl";

export interface PreferencesContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  backgroundImageUrl: string | null;
  setBackgroundImageUrl: (url: string | null) => void;
}

export interface PageInfo {
  title: string;
  url: string;
  domain: string;
  lastModified: string;
  referrer: string;
  description?: string;
  tags: string[];
  html: string;
  timestamp: number;
}

export interface CloudUploadData {
  fileName: string;
  fileContent: string;
  mimeType?: string;
  folderId: string;
}
