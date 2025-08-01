import { motion } from 'framer-motion'
import {
  AlertTriangle,
  FileText,
  Mail,
  RefreshCw,
  Scale,
  Shield,
  Users,
} from 'lucide-react'

import termsData from '../data/termsData.json'

const icons = {
  Users,
  Shield,
  AlertTriangle,
  Scale,
  RefreshCw,
  Mail,
}

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pt-20 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-purple-500/20 rounded-full">
              <FileText className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            {termsData.title}
          </h1>
          <p className="text-gray-300 text-md md:text-lg">
            Effective Date:{' '}
            <span className="text-white font-semibold">
              {termsData.effectiveDate}
            </span>
          </p>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 md:p-12 text-left"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-md md:text-lg text-gray-200 mb-8">{termsData.intro}</p>
            <div className="space-y-8">
              {termsData.sections.map((section, i) => {
                const Icon = section.icon ? icons[section.icon] : null
                const delay = 0.1 * i

                // Special section (warranty/liability)
                if (
                  section.variant === 'warning' ||
                  section.variant === 'danger'
                ) {
                  const bg =
                    section.variant === 'warning'
                      ? 'bg-yellow-500/10 border border-yellow-500/20'
                      : 'bg-red-500/10 border border-red-500/20'

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay }}
                      className={`${bg} rounded-xl p-6`}
                    >
                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-white">
                        {section.title}
                      </h2>
                      <p className="text-gray-200 leading-relaxed text-md md:text-lg ">
                        {section.content}
                      </p>
                    </motion.div>
                  )
                }

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay }}
                    className="flex gap-4"
                  >
                    {Icon && (
                      <div
                        className={`flex-shrink-0 p-3 rounded-lg ${section.iconBg}`}
                      >
                        <Icon className={`w-6 h-6 ${section.iconColor}`} />
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg md:text-xl lg:text-2xl  font-bold mb-4 text-white">
                        {section.id}. {section.title}
                      </h2>
                      {Array.isArray(section.content) ? (
                        <ul className="space-y-3 text-gray-200 text-md md:text-lg">
                          {section.content.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                              <div>{point}</div>
                            </li>
                          ))}
                        </ul>
                      ) : section.email ? (
                        <p className="text-gray-200 leading-relaxed">
                          {section.content}{' '}
                          <a
                            href={`mailto:${section.email}`}
                            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                          >
                            {section.email}
                          </a>
                        </p>
                      ) : (
                        <p className="text-gray-200 leading-relaxed">
                          {section.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService
