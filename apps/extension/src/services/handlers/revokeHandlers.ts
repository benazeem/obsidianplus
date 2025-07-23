import {
  setDropboxConnected,
  setDropboxFolders,
  setDropboxUserInfo,
} from "@/features/dropboxSlice";
import {
  setGoogleDriveConnected,
  setGoogleDriveFolders,
  setGoogleDriveUserInfo,
} from "@/features/googleDriveSlice";
import {
  setOneDriveConnected,
  setOneDriveFolders,
  setOneDriveUserInfo,
} from "@/features/oneDriveSlice";
import {
  revokeDropboxAuth,
  revokeGDriveConnection,
  revokeOneDriveConnection,
} from "@/services/background";
import type { AppDispatch } from "@/store";

export default function disconnectCloud(cloud: string, dispatch: AppDispatch) {
  switch (cloud) {
    case "gdrive":
      return disconnectGoogleDrive(dispatch);
    case "onedrive":
      return disconnectOneDrive(dispatch);
    case "dropbox":
      return disconnectDropbox(dispatch);
    default:
      throw new Error("Unsupported cloud storage type");
  }
}

const disconnectGoogleDrive = async (dispatch: AppDispatch) => {
  try {
    await revokeGDriveConnection();
    console.log("Google Drive disconnected successfully");
    dispatch(setGoogleDriveConnected(false));
    dispatch(setGoogleDriveFolders([]));
    dispatch(setGoogleDriveUserInfo(null));
  } catch (error) {
    console.error("Error disconnecting Google Drive:", error);
  }
};

const disconnectOneDrive = async (dispatch: AppDispatch) => {
  try {
    await revokeOneDriveConnection();
    console.log("OneDrive disconnected successfully.");
    dispatch(setOneDriveConnected(false));
    dispatch(setOneDriveFolders([]));
    dispatch(setOneDriveUserInfo(null));
  } catch (error) {
    console.error("Error disconnecting OneDrive:", error);
  }
};

const disconnectDropbox = async (dispatch: AppDispatch) => {
  try {
    await revokeDropboxAuth();
    console.log("Dropbox disconnected successfully.");
    dispatch(setDropboxConnected(false));
    dispatch(setDropboxFolders([]));
    dispatch(setDropboxUserInfo(null));
  } catch (error) {
    console.error("Error disconnecting Dropbox:", error);
  }
};
