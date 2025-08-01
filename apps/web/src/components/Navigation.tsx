type Props = {
  step: number
  maxSteps: number
  nextDisabled: boolean
  handleBack: () => void
  handleNext: () => void
}

export default function Navigation({ step, maxSteps, nextDisabled, handleBack, handleNext }: Props) {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-t border-white/10">
      <button
        onClick={handleBack}
        disabled={step === 1}
        className={`text-md px-8 py-4 rounded-full font-semibold transition ${
          step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
        }`}
      >
        Back
      </button>
      <button
        onClick={handleNext}
        disabled={nextDisabled || step === maxSteps}
        className={`text-md px-8 py-4 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50`}
      >
        {step === maxSteps ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}
