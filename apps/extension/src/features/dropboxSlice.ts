import type { Folder, UserInfo } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadDropboxState } from "./index";

interface DropboxState {
  connected: boolean;
  folders: Folder[];
  userInfo: UserInfo | null;
}

const initialState: DropboxState = {
  connected: false,
  folders: [],
  userInfo: null,
};

const dropboxSlice = createSlice({
  name: "dropbox",
  initialState,
  reducers: {
    setDropboxConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setDropboxFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setDropboxUserInfo(state, action: PayloadAction<UserInfo | null>) {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadDropboxState.fulfilled, (state, action) => {
      state.connected = action.payload.connected;
      state.folders = action.payload.folders;
      state.userInfo = action.payload.userInfo;
    });
  },
});

export const { setDropboxConnected, setDropboxUserInfo, setDropboxFolders } =
  dropboxSlice.actions;
export default dropboxSlice.reducer;
