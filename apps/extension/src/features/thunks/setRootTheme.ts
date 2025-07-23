import type { Theme } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// In your theme slice or where setTheme is defined
export const setRootTheme = createAsyncThunk(
  "ui/setTheme",
  async (theme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Return the theme to be stored in Redux and persisted
    return theme;
  }
);
