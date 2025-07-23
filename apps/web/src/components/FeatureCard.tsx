import React from 'react'
import * as Icons from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: Array<string>
  icon: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1)
  const IconComponent = (Icons as any)[iconName] || Icons.Circle

  return (
    <div className="feature-card min-w-80 min-h-60 bg-white/30 text-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
      <IconComponent />
      <h4 className="font-bold text-lg mb-2 text-center">{title}</h4>
      <ul className="list-disc list-inside text-sm text-gray-100 space-y-1 text-left">
        {description.map((desc, index) => (
          <li key={index}>{desc}</li>
        ))}
      </ul>
    </div>
  )
}

export default FeatureCard
