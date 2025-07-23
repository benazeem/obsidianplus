 import type { Folder } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadObsidianState } from "./index";

interface ObsidianState {
  connected: boolean;
  folders: Folder[];
  vaultRoots: string[];
}

const initialState: ObsidianState = {
  connected: false,
  folders: [],
  vaultRoots: [],
};

const obsidianSlice = createSlice({
  name: "obsidianVault",
  initialState,
  reducers: {
    setObsidianConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setObsidianFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    addObsidianVaultRoot(state, action: PayloadAction<string>) {
      const vaultRoot = action.payload;
      if (
        state.vaultRoots.length === 0 ||
        !state.vaultRoots.includes(vaultRoot)
      ) {
        state.vaultRoots.push(vaultRoot);
      }
    },
    removeObsidianVaultRoot(state, action: PayloadAction<string>) {
      const vaultRoot = action.payload;
      state.vaultRoots = state.vaultRoots.filter((root) => root !== vaultRoot);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadObsidianState.fulfilled, (state, action) => {
      state.connected = action.payload.connected;
      state.folders = action.payload.folders;
      state.vaultRoots = action.payload.vaultRoots;
    });
  },
});

export const {
  setObsidianConnected,
  setObsidianFolders,
  addObsidianVaultRoot,
  removeObsidianVaultRoot,
} = obsidianSlice.actions;
export default obsidianSlice.reducer;
