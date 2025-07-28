// components/SettingsNotification.tsx
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { hideNotification } from '@/features/notificationSlice'

const SettingsNotification = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { message, type, visible } = useSelector(
    (state: RootState) => state.notification,
  )

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        dispatch(hideNotification())
      }, 4000)
      return () => clearTimeout(timeout)
    }
  }, [visible, dispatch])

  return (
    <div
      style={{
        position: 'absolute',
        top: 50,
        left: 20,
        background:
          type === 'error'
            ? '#f44336'
            : type === 'warning'
              ? '#ff9800'
              : '#4CAF50',
        color: '#E0E0E0',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        zIndex: 999999,
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif`,
        fontSize: '14px',
        maxWidth: '300px',
        transition:
          'transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s cubic-bezier(.4,0,.2,1)',
        transform: visible ? 'translateX(0)' : 'translateX(-120%)',
        opacity: visible ? 1 : 0,
      }}
    >
      {message}
    </div>
  )
}

export default SettingsNotification
