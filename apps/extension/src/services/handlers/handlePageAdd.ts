import { htmlPageToMarkdown } from '@/utils/markdownConverter'
import saveCloudFile from './saveFileHanlders'
import type { FolderEntry } from '@/types'
import setNotification from '@/utils/Notification'

function sanitizeFileName(name: string): string {
  return name
    .replace(/[:*?"<>|\\/]/g, '')
    .replace(/[^a-zA-Z0-9\-_. ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

type HandlePageAddParams = {
  output: 'markdown' | 'capture' | 'metaData'
  location: 'obsidian' | 'googledrive' | 'onedrive' | 'dropbox'
  folder: FolderEntry
}

export const handlePageAdd = async ({
  output,
  location,
  folder,
}: HandlePageAddParams) => {
  const pageMarkdown = await htmlPageToMarkdown()
  let fileContent = pageMarkdown.markdown
  const fileName =
    pageMarkdown.title?.trim() !== ''
      ? `${pageMarkdown.title}_${new Date().toISOString().split('T')[0]}.md`
      : `Untitled_${new Date().toISOString().split('T')[0]}.md`

  if (output === 'capture') {
    setNotification('Capturing full page content...', 'info')
    const tab = await new Promise<chrome.tabs.Tab | undefined>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs && tabs.length > 0 ? tabs[0] : undefined)
      })
    })
    if (!tab) {
      setNotification('No active tab found to capture full page', 'error')
      return
    }
    const response = await new Promise<any>((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { type: 'CAPTURE_FULL_PAGE' },
        (resp) => {
          if (chrome.runtime.lastError) {
            setNotification(
              'Runtime error in capturing full page: ' +
                chrome.runtime.lastError.message,
              'error',
            )
            resolve(undefined)
            return
          }
          resolve(resp)
        },
      )
    })
    if (response?.success) {
      fileContent = response.data
      setNotification('Full page content captured successfully', 'info')
    } else {
      setNotification('Failed to capture full page content', 'warning')
      return
    }
  }
  if (output === 'metaData') {
    const frontmatter = pageMarkdown.frontmatter
    fileContent = frontmatter
    setNotification('Captured metadata successfully', 'info')
  }

  if (location === 'obsidian') {
    const sanitizedFileName = sanitizeFileName(fileName)
    setNotification(`Saving file to Obsidian: ${sanitizedFileName}`, 'info')
    const filePath = `${folder.path}/${sanitizedFileName}`
    try {
      chrome.runtime.sendMessage(
        {
          type: 'SAVE_OBSIDIAN_FILE',
          payload: { content: fileContent, path: filePath },
        },
        (response) => {
          if (chrome.runtime.lastError) {
            setNotification(
              'Runtime error in saving Obsidian file: ' +
                chrome.runtime.lastError.message,
              'error',
            )
            return
          }
          if (response?.success) {
            setNotification(
              `File saved successfully to Obsidian: ${filePath}`,
              'info',
            )
          }
        },
      )
    } catch (error) {
      setNotification(
        'Unexpected error in saving Obsidian file: ' + error,
        'error',
      )
    }
  }
  if (location === 'googledrive') {
    saveCloudFile(location, {
      fileContent,
      fileName,
      mimeType: 'text/plain',
      folderId: folder.id,
    })
  }
  if (location === 'onedrive') {
    saveCloudFile(location, {
      fileContent,
      fileName,
      mimeType: 'text/markdown',
      folderId: folder.id,
    })
  }
  if (location === 'dropbox') {
    saveCloudFile(location, {
      fileContent,
      fileName,
      mimeType: 'text/markdown',
      folderId: folder.path,
    })
  }
}
