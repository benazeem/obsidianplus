import { motion } from 'motion/react'
import { Download } from 'lucide-react'
import type { FormData, OSType } from '@/types'
import generateBashScript from '@/utils/bashGenerator'
import generateManifestFile from '@/utils/manifestGenerator'

type ManifestDownloaderProps = {
  formData: FormData
  setFormData: (data: FormData) => void
  setNextDisabled: (disabled: boolean) => void
  setIsDownloading: (isDownloading: boolean) => void
  isDownloading: boolean
}

function ManifestDownloader({
  formData,
  setFormData,
  setNextDisabled,
  setIsDownloading,
  isDownloading,
}: ManifestDownloaderProps) {
  const handleManifestDownload = async (hostLocation: string, os: OSType) => {
    if (!hostLocation) {
      alert('Please fill in all fields before downloading.')
      return
    }

    setIsDownloading(true)

    try {
      const extension = os === 'windows' ? 'bat' : 'sh'
      const manifest = await generateManifestFile(os!)

      const batFile = `@echo off
cd "${hostLocation}"
start obsidianplushost.exe`

      const shFile = await generateBashScript(hostLocation)
      const manifestContent = JSON.stringify(manifest, null, 2)
      const scriptContent = os === 'windows' ? batFile : shFile

      // Create a zip file containing both manifest.json and the script file
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      zip.file('com.obsidianplus.host.json', manifestContent)
      zip.file(`obsidianPlus.${extension}`, scriptContent)
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const zipUrl = URL.createObjectURL(zipBlob)

      const zipLink = document.createElement('a')
      zipLink.href = zipUrl
      zipLink.download = 'obsidian-plus-manifest.zip'
      document.body.appendChild(zipLink)
      zipLink.click()
      document.body.removeChild(zipLink)
      URL.revokeObjectURL(zipUrl)

      setNextDisabled(false)
    } catch (error) {
      console.error('Error generating files:', error)
      alert('Error generating files. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-6">Configure Host Location</h3>
      <p className="text-gray-300 mb-6">
        Enter the full path where you extracted the native host files.
      </p>
      <div className="mb-6">
        <label
          htmlFor="hostLocation"
          className="block text-sm font-medium mb-2"
        >
          Host Location Path
        </label>
        <input
          type="text"
          id="hostLocation"
          placeholder={`e.g., ${formData.os === 'windows' ? 'C:\\Users\\YourName\\obsidian-host' : '/usr/local/bin/obsidian-host'}`}
          value={formData.hostLocation}
          onChange={(e) =>
            setFormData({ ...formData, hostLocation: e.target.value })
          }
          className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() =>
          formData.os &&
          handleManifestDownload(formData.hostLocation, formData.os)
        }
        disabled={
          !formData.hostLocation.trim() || !formData.os || isDownloading
        }
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
      >
        {isDownloading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating Files...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Configuration Files
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

export default ManifestDownloader
