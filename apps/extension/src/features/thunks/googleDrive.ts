import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChromeLocal } from "@/services/background";

export const loadGoogleDriveState = createAsyncThunk(
  "googleDrive/loadState",
  async () => { 
    const connected = await getChromeLocal("googleDriveConnection") || false;
    const folders = await getChromeLocal("googleDriveFolders") || [];
    const userInfo = await getChromeLocal("googleDriveUserInfo") || null;
    return { connected, folders, userInfo };
  }
);

 