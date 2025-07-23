import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChromeLocal } from "@/services/background"; // wherever it's coming from

export const loadUIState = createAsyncThunk("ui/loadState", async () => {
  const fontSize =
    (await getChromeLocal("obsidianplusfontsize")) || "text-base";
  const theme = (await getChromeLocal("obsidianplustheme")) || "system";
  const backgroundImageUrl =
    (await getChromeLocal("obsidianplusbackgroundimageurl")) || null;
  const obsidianInputInterface =
    (await getChromeLocal("obsidianplusinputinterface")) ?? true;
  return { fontSize, theme, backgroundImageUrl, obsidianInputInterface };
});
