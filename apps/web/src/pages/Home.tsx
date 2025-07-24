import {  ArrowDown } from 'lucide-react';
import Features from '../data/features.json'
import WorkSteps from '../data/workSteps.json'
import Hero from "@/components/Hero"
import FeatureCard from "@/components/FeatureCard"
import WorkStep from '@/components/WorkStep';


function Home() {
  return (
    <>
      <div className="w-[90dvw]  mx-auto bg-gradient-from-tl from-purple-500 bg-gradient-to-br to-purple-900 text-white shadow-lg ">
       <Hero />
       <div className="features-wrapper w-full overflow-hidden"> 
        <h2 className='text-4xl font-bold p-8'>Features</h2>
        <div className='feature-section flex justify-evenly items-center gap-4 p-2 md:p-8 overflow-scroll'>
         {Features.map((feature, index) => { 
         
           return (
             <FeatureCard
               key={index}
               title={feature.title}
               description={feature.description}
               icon={feature.icon}
             />
           );
         })}</div>
       </div>
       <div className=''>
            <h2 className='text-4xl font-bold p-8'>How It Works</h2>
            <div className='work-steps flex flex-col items-center gap-2 p-8'>
                 {WorkSteps.map((step, index) => {
                     return (<>
                         <WorkStep
                             key={index}
                             title={step.title}
                             description={step.description}
                             icon={step.icon}
                             step={step.step}
                         />
                           {step.step < WorkSteps.length && <ArrowDown className="w-8 h-8 md:mb-2 text-white" />}
                         </>
                     );
                 })}
            </div>
       </div>
      </div>
    </>
  )
}

export default Home
