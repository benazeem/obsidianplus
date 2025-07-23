import { Link } from '@tanstack/react-router'
import { Download, MoveRight } from 'lucide-react'
import { motion } from 'motion/react'
import { ThreeScene } from '../components/ThreeScene'

function Hero() {
  return (
    <>
      <div className="hero-section pt-[12dvh] px-10 h-[90dvh] w-full flex  items-center justify-center ">
        <div className=" w-1/2 mx-auto text-center p-4 gap-2 rounded-lg flex flex-col items-center">
          <div className="border-[1px] text-sm border-blue-300 text-blue-200 rounded-md inset-0 max-w-max px-2 ">
            Extension + Native Host
          </div>
          <h1 className="text-4xl font-bold mb-4">Obsidian+ Web Clipper</h1>
          <p className="text-lg mb-6 w-2/3 mx-auto">
            The extension to clip content from the web directly into your
            Obsidian vault.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 ">
              <Download className="inline mr-2" />
              Install Extension
            </button>
            <div className="bg-black text-blue-300 px-4 py-2 rounded-md border-blue-500 border-[1px] hover:bg-blue-500 hover:text-black">
              <Link to="/install"> 
                <MoveRight className="inline mr-2" />
                Native Host Installation
              </Link>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-1/2 flex justify-center rounded-lg overflow-hidden three-scene-container"
        >
          <ThreeScene />
        </motion.div>
      </div>
    </>
  )
}

export default Hero
