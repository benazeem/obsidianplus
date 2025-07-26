import { htmlPageToMarkdown } from '@/utils/markdownConverter'
import saveCloudFile from './saveFileHanlders'
import type { FolderEntry } from '@/types'

function sanitizeFileName(name: string): string {
  return name
    .replace(/[:*?"<>|\\/]/g, '') // remove illegal characters
    .replace(/\s+/g, ' ') // collapse spaces
    .trim()
}

type HandlePageAddParams = {
  output: 'markdown' | 'capture' | 'metaData'
  location: 'obsidian' | 'googledrive' | 'onedrive' | 'dropbox'
  folder: FolderEntry
}

export const handlePageAdd = async ({ output, location, folder }: HandlePageAddParams) => {
  const pageMarkdown = await htmlPageToMarkdown()
  let fileContent = pageMarkdown.markdown
  const fileName =
    pageMarkdown.title?.trim() !== ''
      ? `${pageMarkdown.title}_${new Date().toISOString().split('T')[0]}.md`
      : `Untitled_${new Date().toISOString().split('T')[0]}.md`

  if (output === 'capture') {
    console.log('Capturing full page content...')
    const tab = await new Promise<chrome.tabs.Tab | undefined>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs && tabs.length > 0 ? tabs[0] : undefined)
      })
    })
    if (!tab) {
      console.error('No active tab found')
      return
    }
    const response = await new Promise<any>((resolve) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { type: 'CAPTURE_FULL_PAGE' },
        (resp) => {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError.message)
            resolve(undefined)
            return
          }
          resolve(resp)
        },
      )
    })
    console.log('Response from content script:', response)
    if (response?.success) {
      fileContent = response.data
      console.log('Captured full page content:', fileContent)
    } else {
      console.warn('❌ Failed to capture full page:', response?.error)
    }
  }
  if (output === 'metaData') {
    const frontmatter = pageMarkdown.frontmatter
    fileContent = frontmatter
    console.log('Captured metadata:', fileContent)
  }

  if (location === 'obsidian') {
    const sanitizedFileName = sanitizeFileName(fileName)
    const filePath = `${folder.path}/${sanitizedFileName}`
    console.log('Saving file to Obsidian:', filePath)
    try {
      chrome.runtime.sendMessage(
        {
          type: 'SAVE_OBSIDIAN_FILE',
          payload: { content: fileContent, path: filePath },
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError.message)
            return
          }
          if (response?.success) {
            // console.log("File saved successfully:", response.data);
          }
        },
      )
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }
  if (location === 'googledrive') {
    // console.log(`Saving file to ${location} folder:`, folder.name);
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
