import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeToggle } from './ThemeToggle'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  Input,
  Button,
} from '@obsidianplus/ui'
import type { RootState } from '@/store'
import { setBackgroundImageUrl, setFontSize } from '@/features/uiSlice'
import { CircleCheckBig, Trash } from 'lucide-react'
import { showNotification } from '@/features/notificationSlice'

function UIManager() {
  const background = useSelector(
    (state: RootState) => state.ui.backgroundImageUrl,
  )
  const [backgroundUrl, setBackgroundUrl] = useState<string>('')
  const dispatch = useDispatch()
  const fontSize = useSelector((state: RootState) => state.ui.fontSize)

  const handleBackgroundChange = () => {
    setBackgroundUrl('')
    if (backgroundUrl && backgroundUrl.trim() !== '') {
      try {
        new URL(backgroundUrl)
        dispatch(setBackgroundImageUrl(backgroundUrl))
        dispatch(
          showNotification({
            message: 'Background image updated successfully.',
            type: 'info',
          }),
        )
      } catch {
        dispatch(
          showNotification({
            message:
              'Invalid URL format. Please enter a valid URL for the background image.',
            type: 'warning',
          }),
        )
      }
    } else {
      dispatch(setBackgroundImageUrl(null))
      dispatch(
        showNotification({
          message: 'Background URL is empty, using default.(null)',
          type: 'warning',
        }),
      )
    }
  }

  return (
    <div aria-label="Theme & Appearance">
      <h2 className="text-xl font-semibold mb-2">Theme & Appearance</h2>
      <p className=" mb-4 ">
        Configure the theme, font size, and color scheme for the extension.
      </p>
      <div className="w-full flex justify-between px-2 items-center flex-wrap gap-4">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span>Theme:</span>
          <ThemeToggle />
        </div>
        <div className="flex justify-center items-center gap-2 mb-2">
          <span>Font Size:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={'sm'}>
                {fontSize === 'text-sm'
                  ? '14px'
                  : fontSize === 'text-lg'
                    ? '18px'
                    : '16px'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  dispatch(setFontSize('text-sm'))
                  dispatch(showNotification({ message: 'Font size changed to Small(14px).', type: 'info' }))
                }}
              >
                Small(14px)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  dispatch(setFontSize('text-base'))
                  dispatch(showNotification({ message: 'Font size changed to Medium(16px).', type: 'info' }))
                }}
              >
                Medium(16px)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  dispatch(setFontSize('text-lg'))
                  dispatch(showNotification({ message: 'Font size changed to Large(18px).', type: 'info' }))
                }}
              >
                Large(18px)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className=" flex justify-between items-center gap-2">
          <label className=" flex justify-center items-center gap-2">
            <span>Background:</span>
            <Input
              value={backgroundUrl}
              type="url"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setBackgroundUrl(e.target.value)
              }}
              title="Enter a valid URL for the background image"
              className=" px-2 rounded outline-none shadow-none focus:outline-none"
              placeholder="https://exampleimage.com/image.jpg"
            />
          </label>
          <Button
            disabled={!backgroundUrl.trim()}
            className=""
            onClick={handleBackgroundChange}
          >
            <CircleCheckBig size={16} />
          </Button>
          <Button
            className="bg-red-500  hover:bg-red-600"
            onClick={() => {
              dispatch(setBackgroundImageUrl(null))
            }}
            title="Remove Background"
            disabled={!background}
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UIManager
