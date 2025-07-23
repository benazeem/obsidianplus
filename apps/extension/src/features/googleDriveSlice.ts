import type { Folder, UserInfo } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadGoogleDriveState } from "./index";

interface GoogleDriveState {
  connected: boolean;
  folders: Folder[];
  userInfo: UserInfo | null;
}

const initialState: GoogleDriveState = {
  connected: false,
  folders: [],
  userInfo: null,
};

const googleDriveSlice = createSlice({
  name: "googleDrive",
  initialState,
  reducers: {
    setGoogleDriveConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setGoogleDriveFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setGoogleDriveUserInfo(state, action: PayloadAction<UserInfo | null>) {
      state.userInfo = action.payload;
    },
  },
   extraReducers: (builder) => {
    builder.addCase(loadGoogleDriveState.fulfilled, (state, action) => {
      state.connected = action.payload.connected;
      state.folders = action.payload.folders;
      state.userInfo = action.payload.userInfo;
    });
  },
});

export const { setGoogleDriveConnected, setGoogleDriveFolders, setGoogleDriveUserInfo } =
  googleDriveSlice.actions;
export default googleDriveSlice.reducer;
