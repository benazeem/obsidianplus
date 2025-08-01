import { useState } from 'react'
import { motion } from 'motion/react'
import { AlertCircle, CheckCircle, Download } from 'lucide-react'
import apple from '../assets/apple.svg'
import windows from '../assets/windows.svg'
import linux from '../assets/linux.svg'
import type { FormData, OSDATAType } from '../types'
import StepProgressBar from '@/components/StepProgressBar'
import OSselector from '@/components/OSselector'
import Hostdownloader from '@/components/Hostdownloader'
import Navigation from '@/components/Navigation'
import ManifestDownloader from '@/components/ManifestDownloader'

function Install() {
  const [formData, setFormData] = useState<FormData>({
    os: null,
    hostLocation: '',
    manifestLocation: '',
    step: 1,
  })
  const [nextDisabled, setNextDisabled] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  const OSDATA: OSDATAType = [
    {
      name: 'Windows',
      value: 'windows',
      icon: windows,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Linux',
      value: 'linux',
      icon: linux,
      color: 'from-white to-gray-100',
    },
    {
      name: 'macOS',
      value: 'apple',
      icon: apple,
      color: 'from-gray-500 to-gray-600',
    },
  ]

  const manifestPath = {
    windows:
      'C:\\Users\\<your-username>\\AppData\\Local\\Google\\Chrome\\NativeMessagingHosts',
    linux: '~/.config/google-chrome/NativeMessagingHosts',
    apple: '~/Library/Application Support/Google/Chrome/NativeMessagingHosts',
  }

  const handleRegistrationDownload = (manifestLocation: string) => {
    if (!manifestLocation) {
      alert('Please enter a valid manifest location.')
      return
    }

    const escapedPath =
      manifestLocation.replace(/\\/g, '\\\\') + '\\\\com.obsidianplus.host.json'

    const registrationContent = `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Software\\Google\\Chrome\\NativeMessagingHosts\\com.obsidianplus.host]
@="${escapedPath}"
`

    const blob = new Blob([registrationContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'register-native-host.reg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setNextDisabled(false)
  }

  const maxSteps = 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pt-20 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Native Host Installation
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Follow the steps below to install the Obsidian+ native host for your
            operating system.
          </p>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-200">
            <p className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              This host is required for the Obsidian+ Chrome extension to
              function properly.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <StepProgressBar step={formData.step} maxSteps={maxSteps} />

          <div className="p-8">
            {formData.step === 1 && (
              <OSselector
                OSDATA={OSDATA}
                formData={formData}
                setFormData={setFormData}
                setNextDisabled={setNextDisabled}
              />
            )}

            {formData.step === 2 && (
              <Hostdownloader
                formData={formData}
                setNextDisabled={setNextDisabled}
                OSDATA={OSDATA}
              />
            )}

            {formData.step === 3 && (
              <ManifestDownloader
                formData={formData}
                setIsDownloading={setIsDownloading}
                isDownloading={isDownloading}
                setNextDisabled={setNextDisabled}
                setFormData={setFormData}
              />
            )}

            {formData.step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-6">
                  Install Manifest Files
                </h3>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-200 text-sm">
                    <strong>Important:</strong> Extract the downloaded manifest
                    zip file to the following location:
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <code className="text-blue-300 text-sm break-all">
                    {formData.os && manifestPath[formData.os]}
                  </code>
                </div>

                {formData.os === 'windows' && (
                  <div>
                    <p className="text-gray-300 mb-4">
                      Enter the manifest location for Windows registry
                      registration:
                    </p>
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="e.g., C:\Users\YourName\AppData\Local\Google\Chrome\NativeMessagingHosts"
                        value={formData.manifestLocation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            manifestLocation: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleRegistrationDownload(formData.manifestLocation)
                      }
                      disabled={!formData.manifestLocation.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Download className="w-5 h-5" />
                      Download Registry File
                    </motion.button>
                  </div>
                )}

                {formData.os !== 'windows' && (
                  <div>
                    <p className="text-gray-300 mb-4">
                      For Linux and macOS, run the following command in your
                      terminal:
                    </p>
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <code className="text-blue-300 text-sm break-all">
                        cd ~/.config/google-chrome/NativeMessagingHosts/
                        <br />
                        sudo chmod +x obsidianplus.sh
                      </code>
                      <br />
                      <code className="text-blue-300 text-sm break-all">
                        cd Extracted Host files <br />
                        sudo chmod +x chrome-sandbox
                      </code>
                    </div>
                    <button
                      onClick={() => setNextDisabled(false)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 mt-4"
                    >
                      Above Commands are Executed.
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {formData.step === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Final Step</h3>
                {formData.os === 'windows' && (
                  <>
                    <p className="text-gray-300 mb-6">
                      Run the downloaded
                      <strong className="text-blue-300">
                        register-native-host.reg
                      </strong>{' '}
                      file to complete the installation.
                    </p>
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                      <p className="text-blue-200 text-sm">
                        If you see a security prompt, click "Yes" or "Run" to
                        allow the registration.
                      </p>
                    </div>
                  </>
                )}
                <p className="text-green-400 text-lg font-semibold">
                  Installation Complete!
                </p>
                <p className="text-gray-300 mt-2">
                  You can now use the Obsidian+ Web Clipper extension.
                </p>
              </motion.div>
            )}
          </div>

          <Navigation
            step={formData.step}
            maxSteps={maxSteps}
            nextDisabled={nextDisabled}
            handleNext={() => {
              setFormData({ ...formData, step: formData.step + 1 })
              setNextDisabled(true)
            }}
            handleBack={() => {
              setFormData({ ...formData, step: formData.step - 1 })
              setNextDisabled(false)
            }}
          />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-gray-300"
        >
          <p>
            Need help? Visit our{' '}
            <a
              href="https://github.com/benazeem/obsidianplus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              GitHub Repository
            </a>{' '}
            or{' '}
            <a
              href="https://github.com/benazeem/obsidianplus/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              report an issue
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Install
