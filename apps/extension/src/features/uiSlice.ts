import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FontSize, Theme } from "@/types"; 
import { loadUIState } from "./index"; 

type uiState = {
  fontSize: FontSize;
  theme: Theme;
  backgroundImageUrl: string | null;
  obsidianInputInterface?: boolean;
};

const initialState: uiState = {
  fontSize: "text-base",
  theme: "system",
  backgroundImageUrl: null,
  obsidianInputInterface: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFontSize(state, action: PayloadAction<FontSize>) {
      state.fontSize = action.payload;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setBackgroundImageUrl(state, action: PayloadAction<string | null>) {
      state.backgroundImageUrl = action.payload;
    },
    setObsidianInputInterface(state, action: PayloadAction<boolean>) {
      state.obsidianInputInterface = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUIState.fulfilled, (state, action) => {
      state.fontSize = action.payload.fontSize;
      state.theme = action.payload.theme;
      state.backgroundImageUrl = action.payload.backgroundImageUrl;
      state.obsidianInputInterface = action.payload.obsidianInputInterface;
    })
  },
});

export const {
  setFontSize,
  setTheme,
  setBackgroundImageUrl,
  setObsidianInputInterface,
} = uiSlice.actions;

export default uiSlice.reducer;
