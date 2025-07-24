import * as fs from "fs";
import * as path from "path";
import type { SaveFileResult } from "../../types/types";
import { log, error as logError } from "./logger";

export function isValidPath(filePath: string): boolean {
  if (!filePath || filePath.trim() === "") return false;
  if (filePath.includes("..") || filePath.includes("~")) return false;

  const systemPaths = [
    "/etc",
    "/bin",
    "/usr",
    "/var",
    "/sys",
    "/proc",
    "C:\\Windows",
    "C:\\Program Files",
  ];

  return !systemPaths.some((sysPath) => filePath.startsWith(sysPath));
}

export async function saveMarkdownFile(
  content: string,
  filePath: string
): Promise<SaveFileResult> {
  try {
    if (!isValidPath(filePath)) {
      throw new Error("Invalid file path provided");
    }

    filePath = path.normalize(filePath);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`Created directory: ${dirPath}`);
    }

    fs.writeFileSync(filePath, content, "utf8");

    log(`Saved file: ${filePath}`);
    return { success: true, message: "File saved successfully" };
  } catch (error) {
    logError(`Error saving file: ${(error as Error).message}`);
    return { success: false, message: (error as Error).message };
  }
}

export async function readFile(filePath: string): Promise<string> {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const content = fs.readFileSync(filePath, "utf8");
    log(`Read file: ${filePath}`);
    return content;
  } catch (error) {
    logError(`Error reading file: ${(error as Error).message}`);
    throw error;
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    fs.unlinkSync(filePath);
    log(`Deleted file: ${filePath}`);
    return true;
  } catch (error) {
    logError(`Error deleting file: ${(error as Error).message}`);
    return false;
  }
}

export async function createDirectory(dirPath: string): Promise<boolean> {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`Created directory: ${dirPath}`);
    }
    return true;
  } catch (error) {
    logError(`Error creating directory: ${(error as Error).message}`);
    return false;
  }
}
