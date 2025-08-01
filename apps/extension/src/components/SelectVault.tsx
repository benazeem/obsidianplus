import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Download, FolderInput, Plus, X } from 'lucide-react'
import type { AppDispatch, RootState } from '@/store'
import { setObsidianInputInterface } from '@/features/uiSlice'
import { Button } from '@obsidianplus/ui'
import { addObsidianVaultRoot, setObsidianFolders } from '@/features'
import setNotification from '@/utils/Notification'
import { obsidianFolderTransformation } from '@/utils/obsidianFolderTransformation'

function SelectVault() {
  const [path, setPath] = useState<string>('')
  const vaultRoots = useSelector(
    (state: RootState) => state.obsidianVault.vaultRoots || [],
  )
  const dispatch = useDispatch<AppDispatch>()
  const handleVaultAdd = () => {
    if (!path || path.trim() === '') {
      setNotification('Vault root path is empty', 'warning')
      return
    }
    const newRoots = path.split(',').map((root) => root.trim())
    if (newRoots.length === 0) {
      setNotification('No valid vault roots provided', 'warning')
      return
    }
    newRoots.forEach((root) => {
      dispatch(addObsidianVaultRoot(root))
    })
    setPath('')
  }

  const handleVaultSync = async () => {
    if (!vaultRoots || vaultRoots.length === 0) {
      setNotification('No vault root provided', 'warning')
      return
    }
    try {
      chrome.runtime.sendMessage(
        { type: 'SCAN_VAULTS', payload: { vaultRoot: vaultRoots } },
        (response) => {
          if (chrome.runtime.lastError) {
            setNotification(
              'Runtime error:' + chrome.runtime.lastError.message,
              'error',
            )
            return
          }
          if (response?.success) {
            const vaults = response.data
            const obsidianFolders = obsidianFolderTransformation(vaults)
            dispatch(setObsidianFolders(obsidianFolders))
            setNotification('Vaults synced successfully', 'info')
          } else {
            setNotification('Vault scan failed: ' + response?.error, 'error')
          }
        },
      )
    } catch (err) {
      setNotification('Unexpected error in  Vault Sync: ' + err, 'error')
    }
  }

  return (
    <>
      <div className="p-2 bg-gray-200 dark:bg-gray-700 backdrop-blur-md shadow-lg rounded-md">
        <div className="flex justify-end">
          <button
            title="Close Obsidian Input Interface"
            className="p-1 bg-red-500 rounded-full dark:text-white"
            onClick={() => dispatch(setObsidianInputInterface(false))}
          >
            <X size={12} />
          </button>
        </div>
        <h3 className=" font-semibold mb-4">
          Give the root location for Obsidian Vault
        </h3>

        <p className="text-sm text-red-600  dark:text-red-500 mb-4">
          Avoid storing your vaults in system folders like <code>C:</code> on
          Windows, or <code>/root</code> or <code>/</code> on Linux, or{' '}
          <code>/System</code> or <code>/Library</code> on MacOS, as this may
          cause permission issues.
        </p>
        <div className=" w-full flex items-center justify-between mb-4">
          <input
            type="text"
            className="w-[90%] p-2 border border-gray-300 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded mb-</p>4 outline-none"
            id="vault-root-input"
            value={path}
            placeholder="Enter vault root directory"
            onChange={(e) => {
              setPath(e.target.value)
            }}
          />
          <Button
            title="Add Vault Root"
            type="button"
            disabled={!path.trim()}
            className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 ml-2 p-1 rounded-md disabled:opacity-90  "
            onClick={() => {
              handleVaultAdd()
            }}
          >
            <Plus size={20} />
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-200 mb-4 break-words ">
          Example: <code>/path/to/obsidian/vaults</code> or{' '}
          <code>/path/to/obsidian/vault1,/path/to/obsidian/vault2</code>
        </p>
        <Button
          className="w-full bg-blue-500  p-2 rounded hover:bg-blue-600"
          disabled={vaultRoots.length === 0}
          onClick={() => {
            handleVaultSync()
          }}
          title="Scan Vaults"
        >
          <FolderInput size={16} />
        </Button>

        {vaultRoots.length > 0 ? (
          <div>
            <span className="mr-2">Vaults:</span>
            {vaultRoots.map((root, index) => (
              <span
                key={index}
                className="text-sm text-gray-700 dark:text-gray-200"
              >
                {root}
                {index < vaultRoots.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center justify-center mt-4">
          <a
            className=" w-full p-2 flex items-center bg-blue-500 hover:bg-blue-600 text-white rounded-md gap-1"
            title="Download Host"
            type="button"
            href="https://obsidianplus.devazeem.me/install"
            rel="noopener noreferrer"
            target="_blank"
          >
            Download Host <Download size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </>
  )
}

export default SelectVault
