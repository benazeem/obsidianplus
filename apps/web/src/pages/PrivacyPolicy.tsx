import * as React from 'react'
import { motion } from 'motion/react'
import { Cloud, Database, Eye, Lock, Mail, Shield } from 'lucide-react'
import privacyPolicyData from '../data/privacyPolicy.json'

const iconMap: Record<string, React.JSX.Element> = {
  Database: <Database className="w-6 h-6 text-blue-400" />,
  Eye: <Eye className="w-6 h-6 text-red-400" />,
  Lock: <Lock className="w-6 h-6 text-green-400" />,
  Cloud: <Cloud className="w-6 h-6 text-yellow-400" />,
  Mail: <Mail className="w-6 h-6 text-purple-400" />,
}

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pt-20 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-md md:text-lg">
            Effective Date:{' '}
            <span className="text-white font-semibold">
              {privacyPolicyData.effectiveDate}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 md:p-12 text-left"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-md md:text-lg text-gray-200 mb-8">
              {privacyPolicyData.intro}
            </p>

            <div className="space-y-8">
              {privacyPolicyData.sections.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div
                    className={`flex-shrink-0 p-3 bg-${section.color}-500/20 rounded-lg`}
                  >
                    {iconMap[section.icon]}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
                      {section.title}
                    </h2>
                    {section.items ? (
                      <ul className="space-y-3 text-gray-200">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 bg-${section.color}-400 rounded-full mt-2 flex-shrink-0`}
                            ></div>
                            <div>
                              {'label' in item && (
                                <strong className="text-white">
                                  {item.label}:
                                </strong>
                              )}{' '}
                              {item.text}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-200">
                        {section.description}
                        {section.contact && (
                          <>
                            {' '}
                            <a
                              href={`mailto:${section.contact}`}
                              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                            >
                              {section.contact}
                            </a>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
