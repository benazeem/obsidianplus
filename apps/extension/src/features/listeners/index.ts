import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { setChromeLocal } from "@/services/background";
import {
  setGoogleDriveConnected,
  setGoogleDriveUserInfo,
  setGoogleDriveFolders,
} from "../googleDriveSlice";
import {
  setDropboxConnected,
  setDropboxUserInfo,
  setDropboxFolders,
} from "../dropboxSlice";
import {
  setObsidianConnected,
  setObsidianFolders,
  addObsidianVaultRoot,
  removeObsidianVaultRoot,
} from "../obsidianSlice";
import {
  setOneDriveConnected,
  setOneDriveFolders,
  setOneDriveUserInfo,
} from "../oneDriveSlice";
import {
  setFontSize,
  setTheme,
  setBackgroundImageUrl,
  setObsidianInputInterface,
} from "../uiSlice"; 

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setGoogleDriveConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: "googleDriveConnection",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setGoogleDriveFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: "googleDriveFolders",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setGoogleDriveUserInfo,
  effect: async (action) => {
    await setChromeLocal({
      key: "googleDriveUserInfo",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setDropboxConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: "dropboxConnection",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setDropboxFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: "dropboxFolders",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setDropboxUserInfo,
  effect: async (action) => {
    await setChromeLocal({
      key: "dropboxUserInfo",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setObsidianConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: "obsidianHostConnection",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setObsidianFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: "obsidianFolders",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(addObsidianVaultRoot, removeObsidianVaultRoot),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const roots = state.obsidianVault.vaultRoots;

    await setChromeLocal({
      key: "obsidianVaultRoots",
      value: roots,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setOneDriveConnected,
  effect: async (action) => {
    await setChromeLocal({
      key: "oneDriveConnection",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setOneDriveFolders,
  effect: async (action) => {
    await setChromeLocal({
      key: "oneDriveFolders",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setOneDriveUserInfo,
  effect: async (action) => {
    await setChromeLocal({
      key: "oneDriveUserInfo",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setFontSize,
  effect: async (action) => {
    await setChromeLocal({
      key: "obsidianplusfontsize",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setTheme,
  effect: async (action) => {
    await setChromeLocal({
      key: "obsidianplustheme",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setObsidianInputInterface,
  effect: async (action) => {
    await setChromeLocal({
      key: "obsidianplusinputinterface",
      value: action.payload,
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: setBackgroundImageUrl,
  effect: async (action) => {
    await setChromeLocal({
      key: "obsidianplusbackgroundimageurl",
      value: action.payload,
    });
  },
});

export { listenerMiddleware };
