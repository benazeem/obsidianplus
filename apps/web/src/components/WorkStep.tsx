import * as Icons from 'lucide-react'

interface WorkStepProps {
    title: string;
    description:  string ;
    icon: string;
    step: number;
}

function WorkStep({ title, description, icon,step }: WorkStepProps) {
     const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
    const IconComponent = (Icons as any)[iconName] || Icons.Circle;
  return (
    <div className='flex items-center justify-start gap-4 bg-gray-50/10 p-4 w-[50%] rounded-lg  transition-shadow duration-300 text-left'>

         <h1 className='text-xl font-bold'>{step}.</h1>

        <IconComponent className="w-12 h-12 text-white mb-4" />
        <div className='flex flex-col w-[90%]'>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className='text-gray-300'>{description}</p>
        </div>
    </div>
  )
}

export default WorkStep