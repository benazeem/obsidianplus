import * as fs from "fs";
import * as path from "path";
import type  { VaultInfo, FileTreeItem } from "../../types/types";
import { log, error as logError } from "./logger";

export async function scanObsidianVaults(
  rootPaths: string[]
): Promise<VaultInfo[]> {
  log("Scanning provided paths for Obsidian vaults...");
  const vaults: VaultInfo[] = [];

  try {
    for (const rootPath of rootPaths) {
      if (fs.existsSync(rootPath)) {
        await recursiveVaultScan(rootPath, vaults);
      }
    }

    log(`✅ Found ${vaults.length} Obsidian vault(s).`);

    if (vaults.length === 0) {
      logError("No Obsidian vaults found in the provided paths.");
      throw new Error("No Obsidian vaults found in the provided paths.");
    }

    return vaults;
  } catch (error) {
    logError(`❌ Error during scan: ${(error as Error).message}`);
    return [];
  }
}

async function recursiveVaultScan(
  dirPath: string,
  vaults: VaultInfo[]
): Promise<void> {
  try {
    const items = fs.readdirSync(dirPath);

    if (items.includes(".obsidian")) {
      const obsidianPath = path.join(dirPath, ".obsidian");
      if (fs.statSync(obsidianPath).isDirectory()) {
        const vaultInfo: VaultInfo = {
          name: path.basename(dirPath),
          path: dirPath,
          obsidianPath,
          folders: await getFolderTree(dirPath),
        };
        vaults.push(vaultInfo);
        log(`📁 Found vault: ${dirPath}`);
        return; // Stop recursion once a vault is found in this path
      }
    } else if (!items.includes(".obsidian") && items.length > 0) {
      // If no .obsidian folder, check if it's a valid vault by looking for other indicators ?
    }

    for (const item of items) {
      if (item.startsWith(".") || isSystemDirectory(item)) continue;

      const itemPath = path.join(dirPath, item);
      try {
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          await recursiveVaultScan(itemPath, vaults);
        }
      } catch {
        continue;
      }
    }
  } catch {
    // Ignore inaccessible directories
  }
}

async function getFolderTree(dirPath: string): Promise<FileTreeItem[]> {
  const tree: FileTreeItem[] = [];

  try {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      if (item.startsWith(".")) continue;

      const itemPath = path.join(dirPath, item);
      try {
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          const folderInfo: FileTreeItem = {
            name: item,
            path: itemPath,
            type: "folder",
            children: await getFolderTree(itemPath),
          };
          tree.push(folderInfo);
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    logError(`Error reading directory ${dirPath}: ${(error as Error).message}`);
  }

  return tree;
}

function isSystemDirectory(dirName: string): boolean {
  const systemDirs = new Set([
    "node_modules",
    "System Volume Information",
    "$RECYCLE.BIN",
    "Windows",
    "Program Files",
    "Program Files (x86)",
    "ProgramData",
    "AppData",
    "Library",
    "Applications",
    ".Trash",
    ".cache",
  ]);
  return systemDirs.has(dirName);
}
