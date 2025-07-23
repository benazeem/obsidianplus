import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChromeLocal } from "@/services/background"; // wherever it's coming from

export const loadOneDriveState = createAsyncThunk(
  "oneDrive/loadState",
  async () => {
    const connected = (await getChromeLocal("oneDriveConnection")) || false;
    const folders = (await getChromeLocal("oneDriveFolders")) || [];
    const userInfo = (await getChromeLocal("oneDriveUserInfo")) || null;
    return { connected, folders, userInfo };
  }
);
