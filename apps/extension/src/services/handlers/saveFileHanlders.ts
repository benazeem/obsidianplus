import { dropboxApi, googleDriveApi, oneDriveApi } from '@/features'
import { store } from '@/store'
import type { CloudUploadData } from '@/types'
import setNotification from '@/utils/Notification'

export default function saveCloudFile(cloud: string, fileData: any) {
  switch (cloud) {
    case 'googledrive':
      return saveGoogleDriveFile(fileData)
    case 'onedrive':
      return saveOneDriveFile(fileData)
    case 'dropbox':
      return saveDropboxFile(fileData)
    default:
      setNotification('Unsupported cloud storage type', 'error')
  }
}

const saveGoogleDriveFile = async (fileData: any) => {
  try {
    const result = await store
      .dispatch(googleDriveApi.endpoints.uploadFileToDrive.initiate(fileData))
      .unwrap()
    setNotification(
      `File saved successfully to Google Drive: ${fileData.fileName}`,
      'info',
    )
    return result
  } catch (error) {
    setNotification('Error saving file to Google Drive: ' + error, 'error')
    throw error
  }
}

const saveOneDriveFile = async (fileData: CloudUploadData) => {
  try {
    const result = await store
      .dispatch(oneDriveApi.endpoints.uploadFileToOneDrive.initiate(fileData))
      .unwrap()
    setNotification(
      `File saved successfully to OneDrive: ${fileData.fileName}`,
      'info',
    )
    return result
  } catch (error) {
    setNotification('Error saving file to OneDrive: ' + error, 'error')
    throw error
  }
}

const saveDropboxFile = async (fileData: any) => {
  try {
    const result = await store
      .dispatch(dropboxApi.endpoints.uploadDropboxFile.initiate(fileData))
      .unwrap()
    setNotification(
      `File saved successfully to Dropbox: ${fileData.fileName}`,
      'info',
    )
    return result
  } catch (error) {
    setNotification('Error saving file to Dropbox: ' + error, 'error')
    throw error
  }
}
