import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../features/uiSlice'
import googleDriveReducer from '../features/googleDriveSlice'
import dropboxReducer from '../features/dropboxSlice'
import onedriveReducer from '../features/oneDriveSlice'
import obsidianReducer from '../features/obsidianSlice'
import notificationReducer from '../features/notificationSlice'
import { googleDriveApi, dropboxApi, oneDriveApi } from '@/features'
import { listenerMiddleware } from '@/features/listeners'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    googleDrive: googleDriveReducer,
    dropbox: dropboxReducer,
    onedrive: onedriveReducer,
    obsidianVault: obsidianReducer,
    notification: notificationReducer,
    [googleDriveApi.reducerPath]: googleDriveApi.reducer,
    [dropboxApi.reducerPath]: dropboxApi.reducer,
    [oneDriveApi.reducerPath]: oneDriveApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(
        googleDriveApi.middleware,
        dropboxApi.middleware,
        oneDriveApi.middleware,
      ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
