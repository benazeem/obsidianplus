import { useState } from 'react'

type FormData = {
  os: 'windows' | 'linux' | 'apple' | null
  hostLocation: string
  manifestLocation: string
  Step: number
}

function Install() {
  const [formData, setFormData] = useState<FormData>({
    os: null,
    hostLocation: '',
    manifestLocation: '',
    Step: 1,
  })
  const [nextDisabled, setNextDisabled] = useState(true)

  const manifestPath = {
    windows:
      'C:\\Users\\<your-username>\\AppData\\Local\\Google\\Chrome\\NativeMessagingHosts',
    linux: '~/.config/google-chrome/NativeMessagingHosts',
    apple: '~/Library/Application Support/Google/Chrome/NativeMessagingHosts',
  }
  const handleManifestDownload = async (hostLocation: string, os: string) => {
    if (!hostLocation || !os) {
      alert('Please fill in all fields before downloading.')
      return
    }
    const EXE_EXTENSION = os === 'Windows' ? 'bat' : 'sh'

    const manifest = {
      name: 'com.obsidianplus.host',
      description:
        'Obsidian Plus Native Messaging Host: Native host for Obsidian Plus Chrome extension',
      path: `obsidianPlus.${EXE_EXTENSION}`,
      type: 'stdio',
      allowed_origins: ['chrome-extension://nigamflpdbfeopojphaajkmamkbjagfh'],
    }

    const batFile = ` @echo off
cd  ${hostLocation}
start obsidianplushost.exe`

    const shFile = `#!/bin/bash

echo "🚀 Starting Obsidian Plus Host..."

# Navigate to the host binary folder
cd  ${hostLocation} || {
  echo "❌ Directory not found. Exiting."
  exit 1
}

# Give execute permission to the binary
chmod +x obsidianplushost

# Run the binary
./obsidianplushost

echo "✅ Obsidian Plus Host started."
`

    const manifestContent = JSON.stringify(manifest, null, 2)
    const batContent = os === 'Windows' ? batFile : shFile

    // Create a zip file containing both manifest.json and the bat/sh file
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    zip.file('com.obsidianplus.host.json', manifestContent)
    zip.file(`obsidianPlus.${EXE_EXTENSION}`, batContent)
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const zipUrl = URL.createObjectURL(zipBlob)

    const zipLink = document.createElement('a')
    zipLink.href = zipUrl
    zipLink.download = 'manifest.zip'
    document.body.appendChild(zipLink)
    zipLink.click()
    document.body.removeChild(zipLink)
    setNextDisabled(false)
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

    // Create a Blob for download
    const blob = new Blob([registrationContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    // Create a link and trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = 'register-native-host.reg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="install-page min-h-screen flex flex-col  items-center justify-center p-6 text-white">
      <h2 className="text-2xl font-semibold my-4">Installation Steps</h2>
      <div className="max-w-3xl w-full min-h-102 flex flex-col justify-between items-center gap-12 bg-gray-800/20 backdrop-blur-md rounded-lg shadow-lg p-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Step {formData.Step}</h3>
        </div>
        <div className=" w-full min-h-44 flex flex-col items-center justify-center gap-4">
          {formData.Step === 1 && (
            <div className="flex items-center justify-evenly w-full gap-4">
              <button
                onClick={() => {
                  setFormData({ ...formData, os: 'windows' })
                  setNextDisabled(false)
                }}
                className="flex flex-col items-center justify-center gap-4 py-4 bg-gray-500 w-1/4 text-xl rounded-lg"
              >
                <img
                  draggable="false"
                  src="/windows.svg"
                  alt="Windows"
                  className="h-24"
                />
                <h4>Windows</h4>
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, os: 'linux' })
                  setNextDisabled(false)
                }}
                className="flex flex-col items-center justify-center gap-4 py-4 bg-gray-300 text-black w-1/4 text-xl rounded-lg"
              >
                <img
                  draggable="false"
                  src="/linux.svg"
                  alt="Linux"
                  className="h-24 "
                />
                <h4>Linux</h4>
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, os: 'apple' })
                  setNextDisabled(false)
                }}
                className="flex flex-col items-center justify-center gap-4 py-4 bg-gray-500 w-1/4 text-xl rounded-lg"
              >
                <img
                  draggable="false"
                  src="/apple.svg"
                  alt="Apple"
                  className="h-24"
                />
                <h4>Apple</h4>
              </button>
            </div>
          )}
          {formData.Step === 2 && (
            <div className="flex flex-col items-center justify-center gap-4 w-[80%]">
              <p>
                Download the <strong>Obsidian+ Web Clipper</strong> zip file for
                your operating system
              </p>
              <button
                onClick={() => {
                  window.open(
                    'https://github.com/benazeem/obsidianplus/releases/download/v1.0.0/obsidianplus.exe',
                    '_blank',
                  )
                  setNextDisabled(false)
                }}
                className="mt-4 bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg"
              >
                Download
              </button>
              <p className="mt-4">
                Once downloaded, extract the zip file to your desired location
                to access the plugin files.
              </p>
            </div>
          )}
          {formData.Step === 3 && (
            <div className="flex flex-col items-center justify-center gap-4 w-[80%]">
              <p className="text-lg">
                Enter the host location where you extracted the host files.
              </p>
              <label htmlFor="hostLocation" className="sr-only">
                Host Location
              </label>
              <input
                type="text"
                placeholder="Enter Host Location(e.g., /usr/local/bin/host)"
                value={formData.hostLocation}
                onChange={(e) =>
                  setFormData({ ...formData, hostLocation: e.target.value })
                }
                className="w-full p-2 bg-gray-700 rounded-lg"
              />
              <button
                onClick={() =>
                  formData.os &&
                  handleManifestDownload(formData.hostLocation, formData.os)
                }
                disabled={!formData.hostLocation.trim() || !formData.os}
                className="mt-4 disabled:bg-gray-500 bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg"
              >
                Download Zip
              </button>
            </div>
          )}
          {formData.Step === 4 && formData.os === 'windows' && (
            <div className="flex flex-col items-center justify-center gap-4 w-[80%]">
              <p>
                Extract the manifest zip files in the following location:&nbsp;
                <span className="text-blue-300 font-semibold">
                  &nbsp;{manifestPath[formData.os]}
                </span>
                and Enter the manifest location below.
              </p>
              <label htmlFor="manifestLocation" className="sr-only">
                Manifest Location
              </label>
              <input
                type="text"
                placeholder="Enter Manifest Location(e.g., /usr/local/bin/manifest.json)"
                value={formData.manifestLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    manifestLocation: e.target.value,
                  })
                }
                className="w-full p-2 bg-gray-700 rounded-lg"
              />
              <button
                onClick={() => {
                  handleRegistrationDownload(formData.manifestLocation)
                  setNextDisabled(false)
                }}
                disabled={!formData.manifestLocation.trim()}
                className="mt-4 disabled:bg-gray-500 bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg"
              >
                Download Registration
              </button>
            </div>
          )}
          {formData.Step === 4 && formData.os !== 'windows' && (
            <div className="flex flex-col items-center justify-center gap-4 w-[80%]">
              <p>
                Extract the manifest zip files in the following location: &nbsp;
                <span className="text-blue-300 font-semibold">
                  {formData.os && manifestPath[formData.os]}
                </span>
              </p>
            </div>
          )}
          {formData.Step === 5 && formData.os === 'windows' && (
            <div className="flex flex-col items-center justify-center gap-4 w-[80%]">
              <p className="text-lg">
                To complete the installation, run the{' '}
                <span className="font-semibold text-blue-300">
                  register.reg
                </span>{' '}
                file you downloaded earlier. This will register the host with
                Windows.
              </p>
              <p>
                If you see a security prompt, click{' '}
                <span className="font-semibold">"Run"</span> or{' '}
                <span className="font-semibold">"Yes"</span> to allow the
                registration.
              </p>
              <p className="text-sm text-gray-400">
                After running the file, you can proceed to use the Obsidian+ Web
                Clipper extension in Chrome.
              </p>
            </div>
          )}
        </div>
        <div className="w-full h-10 flex items-center justify-between gap-4">
          {formData.Step > 1 && (
            <button
              onClick={() =>
                setFormData({ ...formData, Step: formData.Step - 1 })
              }
              className="mt-4 mr-auto disabled:bg-gray-500   bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg"
            >
              Prev. Step
            </button>
          )}
          {(formData.os === 'windows'
            ? formData.Step < 5
            : formData.Step < 4) && (
            <button
              onClick={() => {
                setFormData({ ...formData, Step: formData.Step + 1 })
                setNextDisabled(true)
              }}
              disabled={nextDisabled}
              className="mt-4 ml-auto disabled:bg-gray-500   bg-blue-500 hover:bg-blue-600  font-semibold py-2 px-4 rounded-lg"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Install
