import { Github, Twitter } from 'lucide-react'
import {Link} from '@tanstack/react-router'

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-500 to-purple-900 text-white py-4 px-12 flex flex-col items-center gap-6">
      <div className="pt-2">
        <p className="text-center text-lg">
          A cross-platform bridge between your browser and local filesystem.
          <br />
          Created to enhance productivity and unlock local power for web
          extensions.
        </p>
      </div>
      <div className="w-[90%] h-[1px] bg-gray-100/20" />
      <div className="flex flex-col sm:flex-row justify-between items-start w-full px-6">
        <img src="/icon.ico" alt="" className="w-32 my-auto" />
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Install Extension
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Download Native Host
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Documentation
              </a>
            </li>
          </ul>
        </div>
        {/* Developer & Support */}
        <div>
          <h3 className="font-semibold mb-2">Developer</h3>
          <ul className="space-y-1">
            <li>Created by: Mohd Azeem Malik</li>
            <li>
              GitHub:
              <a href="https://github.com/benazeem" className="hover:underline">
                benazeem
              </a>
            </li>
            <li>
              Email:
              <a
                href="mailto:azeemkhandsari@gmail.com"
                className="hover:underline"
              >
                Gmail
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Connect With Us</h3>
          <ul className="space-y-1 flex gap-2">
            <li>
              <a href="#" className="hover:underline">
                <Twitter />
              </a>
            </li>
            <li>
              {' '}
              <a href="#" className="hover:underline">
                <Github />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-2 w-full flex items-center justify-between text-center text-base text-purple-200">
        <Link to="/privacy-policy" className="hover:underline text-sm">
          Privacy Policy
        </Link>
        <p>&copy; {new Date().getFullYear()} Obsidian Plus. All rights reserved.</p>
        <Link to="/terms-of-service" className="hover:underline text-sm">
          Terms of Service
        </Link>
      </div> 
    </footer>
  )
}

export default Footer
