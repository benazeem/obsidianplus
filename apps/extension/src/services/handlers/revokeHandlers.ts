import {
  setDropboxConnected,
  setDropboxFolders,
  setDropboxUserInfo,
} from '@/features/dropboxSlice'
import {
  setGoogleDriveConnected,
  setGoogleDriveFolders,
  setGoogleDriveUserInfo,
} from '@/features/googleDriveSlice'
import { showNotification } from '@/features/notificationSlice'
import {
  setOneDriveConnected,
  setOneDriveFolders,
  setOneDriveUserInfo,
} from '@/features/oneDriveSlice'
import {
  revokeDropboxAuth,
  revokeGDriveConnection,
  revokeOneDriveConnection,
} from '@/services/background'
import type { AppDispatch } from '@/store'

export default function disconnectCloud(cloud: string, dispatch: AppDispatch) {
  switch (cloud) {
    case 'gdrive':
      return disconnectGoogleDrive(dispatch)
    case 'onedrive':
      return disconnectOneDrive(dispatch)
    case 'dropbox':
      return disconnectDropbox(dispatch)
    default:
      throw new Error('Unsupported cloud storage type')
  }
}

const disconnectGoogleDrive = async (dispatch: AppDispatch) => {
  try {
    await revokeGDriveConnection()
    dispatch(
      showNotification({
        message: 'Google Drive disconnected successfully',
        type: 'info',
      }),
    )
    dispatch(setGoogleDriveConnected(false))
    dispatch(setGoogleDriveFolders([]))
    dispatch(setGoogleDriveUserInfo(null))
  } catch {
    dispatch(
      showNotification({
        message: 'Error disconnecting Google Drive:',
        type: 'error',
      }),
    )
  }
}

const disconnectOneDrive = async (dispatch: AppDispatch) => {
  try {
    await revokeOneDriveConnection()
    dispatch(
      showNotification({
        message: 'OneDrive disconnected successfully',
        type: 'info',
      }),
    )
    dispatch(setOneDriveConnected(false))
    dispatch(setOneDriveFolders([]))
    dispatch(setOneDriveUserInfo(null))
  } catch {
    dispatch(
      showNotification({
        message: 'Error disconnecting OneDrive:',
        type: 'error',
      }),
    )
  }
}

const disconnectDropbox = async (dispatch: AppDispatch) => {
  try {
    await revokeDropboxAuth()
    dispatch(
      showNotification({
        message: 'Dropbox disconnected successfully',
        type: 'info',
      }),
    )
    dispatch(setDropboxConnected(false))
    dispatch(setDropboxFolders([]))
    dispatch(setDropboxUserInfo(null))
  } catch {
    dispatch(
      showNotification({
        message: 'Error disconnecting Dropbox:',
        type: 'error',
      }),
    )
  }
}
