import { getChromeLocal } from "@/services/background";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadDropboxState = createAsyncThunk(
  "dropbox/loadState",
  async () => {
    const connected = (await getChromeLocal("dropboxConnection")) || false;
    const folders = (await getChromeLocal("dropboxFolders")) || [];
    const userInfo = (await getChromeLocal("dropboxUserInfo")) || null;
    return { connected, folders, userInfo };
  }
);
