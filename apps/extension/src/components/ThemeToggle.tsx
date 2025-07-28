import { useDispatch } from 'react-redux'
import { Moon, Sun } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@obsidianplus/ui'
import type { AppDispatch } from '@/store'
import { setTheme } from '@/features'
import { showNotification } from '@/features/notificationSlice'

export function ThemeToggle() {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            dispatch(setTheme('light'))
            dispatch(
              showNotification({ message: 'Theme set to Light', type: 'info' }),
            )
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            dispatch(setTheme('dark'))
            dispatch(
              showNotification({ message: 'Theme set to Dark', type: 'info' }),
            )
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            dispatch(setTheme('system'))
            dispatch(
              showNotification({ message: 'Theme set to System Default', type: 'info' }),
            )
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
