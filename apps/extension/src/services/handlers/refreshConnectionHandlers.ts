import {
  refreshConnection,
  refreshDropboxConnection,
  refreshOneDriveConnection,
} from '@/services/background'
import { googleDriveApi } from '@/features/api/googleDriveApi'
import {
  setGoogleDriveConnected,
  setGoogleDriveFolders,
  setGoogleDriveUserInfo,
} from '@/features/googleDriveSlice'
import type { AppDispatch } from '@/store'
import { dropboxApi } from '@/features/api/dropboxApi'
import {
  setDropboxConnected,
  setDropboxFolders,
  setDropboxUserInfo,
} from '@/features/dropboxSlice'
import {
  setOneDriveConnected,
  setOneDriveFolders,
  setOneDriveUserInfo,
} from '@/features/oneDriveSlice'
import { oneDriveApi } from '@/features/api/oneDriveApi'
import { oneDriveFolderTransformation } from '@/utils/oneDriveFolderTranformation'
import { googleDriveFolderTransformation } from '@/utils/googleDriveFolderTransformation'
import { dropboxFolderTransformation } from '@/utils/dropboxFolderTransformation'
import { showNotification } from '@/features/notificationSlice'

export default function refreshCloudConnection(
  cloud: string,
  dispatch: AppDispatch,
) {
  switch (cloud) {
    case 'gdrive':
      return refreshGoogleDrive(dispatch)
    case 'onedrive':
      return refreshOneDrive(dispatch)
    case 'dropbox':
      return refreshDropbox(dispatch)
    default:
      throw new Error('Unsupported cloud storage type')
  }
}

const refreshGoogleDrive = async (dispatch: AppDispatch) => {
  refreshConnection().then(async () => {
    if (chrome.runtime.lastError) {
      dispatch(showNotification({ message: 'Error refreshing Google Drive connection: ', type: 'error' }))
    } else {
      dispatch(setGoogleDriveConnected(true))
      try {
        const userInfoResponse = await dispatch(
          googleDriveApi.endpoints.getUserInfo.initiate(),
        ).unwrap()

        dispatch(
          setGoogleDriveUserInfo({
            id: userInfoResponse.id,
            name: userInfoResponse.name,
            email: userInfoResponse.email,
            picture: userInfoResponse?.picture || null,
          }),
        )
        const foldersResponse = await dispatch(
          googleDriveApi.endpoints.listDriveFolders.initiate({
            parentId: 'root',
          }),
        ).unwrap()
        const googleDriveFolders = await googleDriveFolderTransformation(
          foldersResponse.folders,
          dispatch,
        )

        dispatch(setGoogleDriveFolders(googleDriveFolders))
        dispatch(showNotification({ message: 'Google Drive connection refreshed successfully', type: 'info' }))
      } catch {
        dispatch(showNotification({ message: 'Failed to refresh Google Drive connection: ', type: 'error' }))
      }
    }
  })
}

const refreshOneDrive = async (dispatch: AppDispatch) => {
  try {
    const token = await refreshOneDriveConnection()
    if (!token) {
      dispatch(showNotification({ message: 'Failed to refresh OneDrive connection: ', type: 'error' }))
      return
    }
    dispatch(setOneDriveConnected(true))

    try {
      const userInfoResponse = await dispatch(
        oneDriveApi.endpoints.getOneDriveUserInfo.initiate(),
      ).unwrap()

      const oneDriveProfile = await dispatch(
        oneDriveApi.endpoints.getOneDriveUserPhoto.initiate(),
      ).unwrap()

      const foldersResponse = await dispatch(
        oneDriveApi.endpoints.listOneDriveFolders.initiate({
          parentId: 'root',
        }),
      ).unwrap()

      const oneDriveFolders = await oneDriveFolderTransformation(
        foldersResponse.folders,
        dispatch,
      )

      dispatch(
        setOneDriveUserInfo({
          id: userInfoResponse.id,
          name: userInfoResponse.displayName,
          email: userInfoResponse.mail,
          picture: oneDriveProfile.dataUrl || null,
        }),
      )
      dispatch(setOneDriveFolders(oneDriveFolders))
      setDropboxConnected(true)
      dispatch(showNotification({ message: 'OneDrive connection refreshed successfully', type: 'info' }))
    } catch {
      dispatch(showNotification({ message: 'Failed to fetch OneDrive data: ', type: 'error' }))
    }
  } catch {
    dispatch(showNotification({ message: 'Error refreshing OneDrive connection: ', type: 'error' }))
  }
}

const refreshDropbox = async (dispatch: AppDispatch) => {
  try {
    const token = await refreshDropboxConnection()
    if (!token) {
      dispatch(showNotification({ message: 'Failed to refresh Dropbox connection: ', type: 'error' }))
      return
    }
    dispatch(setDropboxConnected(true))
    try {
      const userInfo = await dispatch(
        dropboxApi.endpoints.getDropboxUserInfo.initiate(),
      ).unwrap()
      dispatch(
        setDropboxUserInfo({
          id: userInfo.account_id,
          name: userInfo.name.display_name,
          email: userInfo.email,
          picture: userInfo?.profile_photo_url || null,
        }),
      )

      const folders = await dispatch(
        dropboxApi.endpoints.listDropboxFolders.initiate({ path: '' }),
      ).unwrap()

      const dropboxFolders = await dropboxFolderTransformation(
        folders,
        dispatch,
      )

      dispatch(setDropboxFolders(dropboxFolders))
      dispatch(showNotification({ message: 'Dropbox connection refreshed successfully', type: 'info' }))
    } catch {
      dispatch(showNotification({ message: 'Failed to fetch Dropbox data: ', type: 'error' }))
    }
  } catch {
    dispatch(showNotification({ message: 'Error refreshing Dropbox connection: ', type: 'error' }))
  }
}
