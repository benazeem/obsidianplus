import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UIManager from '@/components/UIManager'
import CloudManager from '../components/CloudManager'
import { Input, Button } from '@obsidianplus/ui'
import { Download, Vault, X } from 'lucide-react'
import type { AppDispatch, RootState } from '@/store'
import {
  addObsidianVaultRoot,
  removeObsidianVaultRoot,
  setObsidianFolders,
} from '@/features/obsidianSlice'
import { initializeStates } from '@/services/background'
import SettingsNotification from '@/components/SettingsNotification'
import { obsidianFolderTransformation } from '@/utils/obsidianFolderTransformation'
import { showNotification } from '@/features/notificationSlice'

function Settings() {
  const [currentRootInput, setCurrentRootInput] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const fontSize = useSelector((state: RootState) => state.ui.fontSize)
  const vaultRoots = useSelector(
    (state: RootState) => state.obsidianVault.vaultRoots || [],
  )
  const theme = useSelector((state: RootState) => state.ui.theme)

  const handleRemoveRoot = (root: string) => {
    dispatch(removeObsidianVaultRoot(root))
    dispatch(
      showNotification({
        message: `Removed vault root: ${root}`,
        type: 'info',
      }),
    )
  }
  const handleVaultAdd = () => {
    if (!currentRootInput || currentRootInput.trim() === '') {
      dispatch(
        showNotification({
          message: 'Vault root path is empty',
          type: 'warning',
        }),
      )
      return
    }
    const newRoots = currentRootInput.split(',').map((root) => root.trim())
    if (newRoots.length === 0) {
      dispatch(
        showNotification({
          message: 'No valid vault roots provided',
          type: 'warning',
        }),
      )
      return
    }
    newRoots.forEach((root) => {
      dispatch(addObsidianVaultRoot(root))
    })
    setCurrentRootInput('')
  }
  const handleVaultSync = async () => {
    if (!vaultRoots || vaultRoots.length === 0) {
      dispatch(
        showNotification({
          message: 'No vault root provided',
          type: 'warning',
        }),
      )
      return
    }
    try {
      chrome.runtime.sendMessage(
        { type: 'SCAN_VAULTS', payload: { vaultRoot: vaultRoots } },
        (response) => {
          if (chrome.runtime.lastError) {
            dispatch(
              showNotification({
                message: 'Runtime error: ' + chrome.runtime.lastError.message,
                type: 'error',
              }),
            )
            return
          }
          if (response?.success) {
            const vaults = response.data
            const obsidianFolders = obsidianFolderTransformation(vaults)
            dispatch(setObsidianFolders(obsidianFolders))
            dispatch(
              showNotification({
                message: 'Vaults synced successfully',
                type: 'info',
              }),
            )
          } else {
            dispatch(
              showNotification({
                message: 'Vault scan failed: ' + response?.error,
                type: 'error',
              }),
            )
          }
        },
      )
    } catch (err) {
      dispatch(
        showNotification({
          message: 'Unexpected error in Vault Sync: ' + err,
          type: 'error',
        }),
      )
    }
  }

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const init = async () => {
      try {
        await initializeStates(dispatch)
      } catch (error) {
        console.error('Error initializing states:', error)
      }
    }

    init()
  }, [dispatch])

  return (
    <>
      <div
        className={`w-full ${fontSize} bg-gray-100 dark:bg-gray-900 h-screen overflow-hidden flex flex-col items-center justify-start`}
      >
        <SettingsNotification />
        <div className="w-full flex flex-col items-center justify-center p-4 text-center bg-gray-300 dark:bg-gray-950 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold mb-4 ">Settings</h1>
          <p>This is the settings page for the Obsidian+ extension.</p>
          <p>You can configure your vaults and other settings here.</p>
        </div>
        <div className="p-4 space-y-4 min-w-2/3 ">
          <UIManager />
          <div aria-label="Vault Management">
            <h2 className="text-xl font-semibold mb-2">Vault Management</h2>
            <p className=" mb-4">
              Manage your Obsidian vaults and their settings.
            </p>
            <div className="w-full flex justify-between items-center flex-wrap gap-4">
              <label className="flex items-center gap-2 mb-2 flex-1 min-w-[200px] max-w-[400px]">
                <span className="w-24 block text-right">Vault Root:</span>
                <Input
                  type="text"
                  value={currentRootInput}
                  placeholder="Enter vault root directory"
                  title="Vault Root"
                  className="w-40 flex-1 p-2 rounded outline-none shadow-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentRootInput(e.target.value)
                  }
                />
              </label>
              <Button
                className=" bg-blue-500  hover:bg-blue-600 flex-shrink-0"
                title="Add Vault"
                type="button"
                disabled={!currentRootInput.trim()}
                onClick={() => {
                  handleVaultAdd()
                }}
              >
                Add Vault <Vault size={16} className="ml-1" />
              </Button>
              <Button
                className="bg-green-500  hover:bg-green-600 flex-shrink-0"
                disabled={vaultRoots.length === 0}
                onClick={() => {
                  handleVaultSync()
                }}
                title="Scan Vaults"
              >
                Scan Vaults <Vault size={16} className="ml-1" />
              </Button>
              <a
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-1"
                href="https://obsidianplus.devazeem.me/install"
                rel="noopener noreferrer"
                target="_blank"
                title="Download Host"
                type="button"
              >
                Download Host <Download size={16} className="ml-1" />
              </a>
              <div className="flex-1"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-2 mt-2">
                Example: <code>/path/to/obsidian/vaults</code> or{' '}
                <code>/path/to/obsidian/vault1,/path/to/obsidian/vault2</code>
              </p>
              <div className="flex flex-wrap gap-3 ">
                <span className="font-semibold">Current Vault Roots:</span>
                {vaultRoots.length > 0 ? (
                  vaultRoots.map((root, index) => (
                    <div
                      key={root + index}
                      className="bg-gray-700 dark:bg-gray-200 text-gray-100 dark:text-gray-900 h-4 inset-0 max-w-max p-3 rounded-md flex items-center justify-between gap-1"
                    >
                      <p>{root}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveRoot(root)}
                        title="Remove vault"
                        className="w-4 h-4 bg-red-500  rounded-full flex justify-center items-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-700 dark:bg-gray-200 text-gray-100 dark:text-gray-900 h-4 inset-0 max-w-max p-3 rounded-md flex items-center justify-between gap-1">
                    <p>Currently No Obsidian Vault is Selected.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <CloudManager />
        </div>
      </div>
    </>
  )
}

export default Settings
