import { dropboxApi } from "@/features/api/dropboxApi";
import { googleDriveApi } from "@/features/api/googleDriveApi";
import { oneDriveApi } from "@/features";
import { setDropboxFolders } from "@/features/dropboxSlice";
import { setGoogleDriveFolders } from "@/features/googleDriveSlice";
import { setOneDriveFolders } from "@/features/oneDriveSlice";
import type { AppDispatch } from "@/store";
import { oneDriveFolderTransformation } from "@/utils/oneDriveFolderTranformation";
import { googleDriveFolderTransformation } from "@/utils/googleDriveFolderTransformation";
import { dropboxFolderTransformation } from "@/utils/dropboxFolderTransformation";

export default function refreshCloudFiles(
  cloud: string,
  dispatch: AppDispatch
) {
  switch (cloud) {
    case "gdrive":
      return refreshGoogleDriveFiles(dispatch);
    case "onedrive":
      return refreshOneDriveFiles(dispatch);
    case "dropbox":
      return refreshDropboxFiles(dispatch);
    default:
      throw new Error("Unsupported cloud storage type");
  }
}

const refreshGoogleDriveFiles = async (dispatch: AppDispatch) => {
  try {
    const foldersResponse = await dispatch(
      googleDriveApi.endpoints.listDriveFolders.initiate({
        parentId: "root",
      })
    ).unwrap();

    const googleDriveFolders = await googleDriveFolderTransformation(
      foldersResponse.folders,
      dispatch
    );

    dispatch(setGoogleDriveFolders(googleDriveFolders));
  } catch (error) {
    console.error("Error listing Google Drive files:", error);
    return [];
  }
};

const refreshOneDriveFiles = async (dispatch: AppDispatch) => {
  try { 
    const foldersResponse = await dispatch(
      oneDriveApi.endpoints.listOneDriveFolders.initiate(
        { parentId: "root" },
        { forceRefetch: true }
      )
    ).unwrap();

    const oneDriveFolders = await oneDriveFolderTransformation(
      foldersResponse.folders,
      dispatch
    );
    dispatch(setOneDriveFolders(oneDriveFolders || []));
  } catch (error) {
    console.error("Error listing OneDrive folders:", error);
    return [];
  }
};

const refreshDropboxFiles = async (dispatch: AppDispatch) => {
  try {
    const folders = await dispatch(
      dropboxApi.endpoints.listDropboxFolders.initiate({ path: "" })
    ).unwrap();

    const dropboxFolders = await dropboxFolderTransformation(folders, dispatch);

    dispatch(setDropboxFolders(dropboxFolders));
  } catch (error) {
    console.error("Error listing Dropbox folders:", error);
    return [];
  }
};
