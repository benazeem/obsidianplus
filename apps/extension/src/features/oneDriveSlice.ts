import type { Folder, UserInfo } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadOneDriveState } from "./index";

interface OneDriveState {
  connected: boolean;
  folders: Folder[];
  userInfo: UserInfo | null;
}

const initialState: OneDriveState = {
  connected: false,
  folders: [],
  userInfo: null,
};

const oneDriveSlice = createSlice({
  name: "oneDrive",
  initialState,
  reducers: {
    setOneDriveConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setOneDriveFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setOneDriveUserInfo(state, action: PayloadAction<UserInfo | null>) {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadOneDriveState.fulfilled, (state, action) => {
      state.connected = action.payload.connected;
      state.folders = action.payload.folders;
      state.userInfo = action.payload.userInfo;
    });
  },
});

export const { setOneDriveConnected, setOneDriveFolders, setOneDriveUserInfo } =
  oneDriveSlice.actions;
export default oneDriveSlice.reducer;
