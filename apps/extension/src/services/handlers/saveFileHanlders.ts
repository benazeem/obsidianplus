import { dropboxApi, googleDriveApi, oneDriveApi } from "@/features";
import { store } from "@/store";
import type { CloudUploadData } from "@/types";

export default function saveCloudFile(cloud: string, fileData: any) {
  switch (cloud) {
    case "googledrive":
      return saveGoogleDriveFile(fileData);
    case "onedrive":
      return saveOneDriveFile(fileData);
    case "dropbox":
      return saveDropboxFile(fileData);
    default:
      throw new Error("Unsupported cloud storage type");
  }
}

const saveGoogleDriveFile = async (fileData: any) => {
  try {
    const result = await store
      .dispatch(googleDriveApi.endpoints.uploadFileToDrive.initiate(fileData))
      .unwrap();
    console.log("✅ File saved to Google Drive successfully");
    return result;
  } catch (error) {
    console.error("❌Error saving file to Google Drive:", error);
    throw error;
  }
};

const saveOneDriveFile = async (fileData: CloudUploadData) => {
  try {
    const result = await store
      .dispatch(oneDriveApi.endpoints.uploadFileToOneDrive.initiate(fileData))
      .unwrap();
    console.log("✅ File saved to OneDrive successfully");
    return result;
  } catch (error) {
    console.error("❌ Error saving to OneDrive:", error);
    throw error;
  }
};


const saveDropboxFile = async (fileData: any) => {
    try {
      const result = await store
        .dispatch(dropboxApi.endpoints.uploadDropboxFile.initiate(fileData))
        .unwrap();
      console.log("✅ File saved to Dropbox successfully");
      return result;
    } catch (error) {
      console.error("❌ Error saving to Dropbox:", error);
      throw error;
    }
};
