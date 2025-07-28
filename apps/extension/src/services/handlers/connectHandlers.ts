import {
  authenticate,
  authenticateDropbox,
  authenticateOneDrive,
} from '@/services/background'
import { type AppDispatch } from '@/store'
import { googleDriveApi } from '@/features/api/googleDriveApi'
import {
  setGoogleDriveConnected,
  setGoogleDriveFolders,
  setGoogleDriveUserInfo,
} from '@/features/googleDriveSlice'
import {
  setDropboxConnected,
  setDropboxFolders,
  setDropboxUserInfo,
} from '@/features/dropboxSlice'
import { dropboxApi } from '@/features/api/dropboxApi'
import {
  setOneDriveConnected,
  setOneDriveFolders,
  setOneDriveUserInfo,
} from '@/features/oneDriveSlice'
import { oneDriveApi } from '@/features/api/oneDriveApi'
import { dropboxFolderTransformation } from '@/utils/dropboxFolderTransformation'
import { googleDriveFolderTransformation } from '@/utils/googleDriveFolderTransformation'
import { oneDriveFolderTransformation } from '@/utils/oneDriveFolderTranformation'
import { showNotification } from '@/features/notificationSlice'

export default function connectCloud(cloud: string, dispatch: AppDispatch) {
  switch (cloud) {
    case 'gdrive':
      return connectGoogleDrive(dispatch)
    case 'onedrive':
      return connectOneDrive(dispatch)
    case 'dropbox':
      return connectDropbox(dispatch)
    default:
      throw new Error('Unsupported cloud storage type')
  }
}

const connectGoogleDrive = (dispatch: AppDispatch) => {
  authenticate().then(async () => {
    if (chrome.runtime.lastError) {
      dispatch(
        showNotification({
          message:
            'Error authenticating with Google Drive: ' +
            chrome.runtime.lastError.message,
          type: 'error',
        }),
      )
    } else {
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
          dispatch(
            showNotification({
              message: 'Connected to Google Drive successfully',
              type: 'info',
            }),
          ),
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

        dispatch(setGoogleDriveConnected(true))
      } catch (err) {
        dispatch(
          showNotification({
            message:
              'Failed to fetch Google Drive data: ' + (err as Error).message,
            type: 'error',
          }),
        )
      }
    }
  })
}

const connectOneDrive = async (dispatch: AppDispatch) => {
  try {
    const token = await authenticateOneDrive()
    if (!token) {
      dispatch(
        showNotification({
          message: 'Failed to connect to OneDrive.',
          type: 'error',
        }),
      )
      return
    }

    dispatch(setOneDriveConnected(true))
    try {
      const userInfo = await dispatch(
        oneDriveApi.endpoints.getOneDriveUserInfo.initiate(),
      ).unwrap()

      const userPhoto = await dispatch(
        oneDriveApi.endpoints.getOneDriveUserPhoto.initiate(),
      ).unwrap()
      dispatch(
        setOneDriveUserInfo({
          id: userInfo.id,
          name: userInfo.displayName,
          email: userInfo.mail,
          picture: userPhoto.dataUrl || null,
        }),
      )
      const foldersResponse = await dispatch(
        oneDriveApi.endpoints.listOneDriveFolders.initiate(
          { parentId: 'root' },
          { forceRefetch: true },
        ),
      ).unwrap()
      const oneDriveFolders = await oneDriveFolderTransformation(
        foldersResponse.folders,
        dispatch,
      )
      dispatch(setOneDriveFolders(oneDriveFolders || []))
      dispatch(
        showNotification({
          message: 'Connected to OneDrive successfully',
          type: 'info',
        }),
      )
    } catch (error) {
      dispatch(
        showNotification({
          message: 'Failed to fetch Data: ' + (error as Error).message,
          type: 'error',
        }),
      )
    }
  } catch (error) {
    dispatch(
      showNotification({
        message: 'Error connecting to OneDrive: ' + (error as Error).message,
        type: 'error',
      }),
    )
  }
}

const connectDropbox = async (dispatch: AppDispatch) => {
  try {
    const token = await authenticateDropbox()
    if (!token) {
      dispatch(
        showNotification({
          message: 'Failed to connect to Dropbox.',
          type: 'error',
        }),
      )
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
      dispatch(
        showNotification({
          message: 'Connected to Dropbox successfully',
          type: 'info',
        }),
      )
    } catch (error) {
      dispatch(
        showNotification({
          message: 'Failed to fetch Data: ' + (error as Error).message,
          type: 'error',
        }),
      )
    }
  } catch (error) {
    dispatch(
      showNotification({
        message: 'Error connecting to Dropbox: ' + (error as Error).message,
        type: 'error',
      }),
    )
  }
}

export { connectGoogleDrive, connectOneDrive, connectDropbox }
