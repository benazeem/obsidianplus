import { Download } from 'lucide-react'
import { motion } from 'motion/react'

function Hostdownloader({ formData, setNextDisabled, OSDATA }) {
  return (
    <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold mb-6">
                  Download Native Host
                </h3>
                <p className="text-gray-300 mb-8">
                  Download the Obsidian+ native host application for{' '}
                  {OSDATA.find((os) => os.value === formData.os)?.name}.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    window.open(
                      'https://github.com/benazeem/obsidianplus/releases/latest',
                      '_blank',
                    )
                    setNextDisabled(false)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Download className="w-5 h-5" />
                  Download Native Host
                </motion.button>
                <p className="text-sm text-gray-400 mt-4">
                  Extract the downloaded file to your preferred location.
                </p>
              </motion.div>
  )
}

export default Hostdownloader