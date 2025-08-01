import { motion } from 'motion/react'
import type { FormData, OSDATAType } from '@/types'

type OSselectorProps = {
  OSDATA: OSDATAType
  formData: FormData
  setFormData: (data: FormData) => void
  setNextDisabled: (disabled: boolean) => void
}

function OSselector({
  OSDATA,
  formData,
  setFormData,
  setNextDisabled,
}: OSselectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-6">Select Your Operating System</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OSDATA.map((os) => (
          <button
            key={os.value}
            type="button"
            disabled={os.name === 'macOS'}
            title={os.name === 'macOS' ? 'Coming Soon' : `Select ${os.name}`}
            onClick={() => {
              setFormData({
                ...formData,
                manifestLocation: '',
                hostLocation: '',
                os: os.value,
              })
              setNextDisabled(false)
            }}
            className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 ${
              formData.os === os.value
                ? 'border-blue-500 bg-blue-500/20 shadow-lg scale-105'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <div className={`p-4 rounded-full bg-gradient-to-br ${os.color} `}>
              <img
                src={os.icon}
                alt={os.name}
                contextMenu="false disable"
                className="w-8 h-8"
              />
            </div>
            <span className="text-lg font-semibold">{os.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default OSselector
