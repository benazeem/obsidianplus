import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type NotificationType = 'info' | 'error' | 'warning'

interface NotificationState {
  message: string
  type: NotificationType
  visible: boolean
}

const initialState: NotificationState = {
  message: '',
  type: 'info',
  visible: false,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type: NotificationType }>
    ) => {
      state.message = action.payload.message
      state.type = action.payload.type
      state.visible = true
    },
    hideNotification: (state) => {
      state.visible = false
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer
