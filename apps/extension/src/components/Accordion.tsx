import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Folder, Plus } from 'lucide-react'
import type { FolderEntry } from '../types'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  Button,
} from '@obsidianplus/ui'
import { handlePageAdd } from '@/services/handlers/handlePageAdd'

interface FolderAccordionProps {
  data: FolderEntry[]
  location: 'obsidian' | 'googledrive' | 'onedrive' | 'dropbox'
  level?: number
}

const FolderAccordion: React.FC<FolderAccordionProps> = ({
  location,
  data,
  level = 0,
}) => {
  return (
    <div className="space-y-1">
      {data.map((folder, index) => (
        <FolderAccordionItem
          location={location}
          key={index}
          folder={folder}
          level={level}
        />
      ))}
    </div>
  )
}

const FolderAccordionItem: React.FC<{
  folder: FolderEntry
  level: number
  location: 'obsidian' | 'googledrive' | 'onedrive' | 'dropbox'
}> = ({ location, folder, level }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = folder.folders?.length > 0

  return (
    <div className="border-l border-gray-300 dark:border-gray-950 pl-2 ">
      <button
        type="button"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 pr-4 pl-2 rounded  text-left"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-yellow-600" />
          <span className="text-gray-800 dark:text-gray-200">
            {folder.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasChildren &&
            (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={'sm'}>
                {<Plus size={16} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  handlePageAdd({ output: 'markdown', location, folder })
                }
              >
                + Page Markdown
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() =>
                  handlePageAdd({ output: 'capture', location, folder })
                }
              >
                + Capture Page
              </DropdownMenuItem> */}{' '}
              {/* This feature will be implemented later in future */}
              <DropdownMenuItem
                onClick={() =>
                  handlePageAdd({ output: 'metaData', location, folder })
                }
              >
                + Meta Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </button>

      {isOpen && hasChildren && (
        <div className="ml-2">
          <FolderAccordion
            location={location}
            data={folder.folders}
            level={level + 1}
          />
        </div>
      )}
    </div>
  )
}

export default FolderAccordion
