// obsidianThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getChromeLocal } from "@/services/background";

export const loadObsidianState = createAsyncThunk(
  "obsidian/loadState",
  async () => {
    const connected = await getChromeLocal("obsidianHostConnection") || false;
    const folders = await getChromeLocal("obsidianFolders") || [];
    const vaultRoots = await getChromeLocal("obsidianVaultRoots") || [];
    return { connected, folders, vaultRoots };
  }
);
