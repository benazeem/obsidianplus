import { motion } from 'framer-motion'

type Props = {
  step: number
  maxSteps: number
}

export default function StepProgressBar({ step, maxSteps }: Props) {
  return (
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Step {step} of {maxSteps}</span>
        <span className="text-sm text-gray-300">{Math.round((step / maxSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / maxSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
