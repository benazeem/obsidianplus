import { Github, Twitter } from 'lucide-react'
import { Link } from '@tanstack/react-router'

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-500 to-purple-900 text-white py-4 px-4 md:px-8 lg:px-12 flex flex-col items-center gap-2 text-sm md:text-base lg:text-lg">
      <div className="pt-2">
        <p className="text-center">
          A cross-platform bridge between your browser and local filesystem.
          <br />
          Created to enhance productivity and unlock local power for web
          extensions.
        </p>
      </div>
      <div className="w-[90%] h-[1px] bg-gray-100/20" />
      <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-6 ">
        <div className="flex justify-between items-start w-full">
          <img src="/icon.ico" alt="" className=" w-12 lg:w-32 my-auto" />
          <div className="w-1/2">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://chromewebstore.google.com/detail/nbeeifpffimepiobjmhpfihileadikdo"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  target="_blank"
                >
                  Install Extension
                </a>
              </li>
              <li>
                <Link to="/install" className="hover:underline">
                  Download Native Host
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/benazeem/obsidianplus"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  target="_blank"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Developer & Support */}
        <div className="flex  justify-between items-start w-full">
          <div className="w-1/2 ">
            <h3 className="font-semibold mb-2">Connect With Us</h3>
            <ul className="space-y-1 flex gap-2">
              <li>
                <a
                  title="Follow on Twitter"
                  href="https://x.com/devazeem"
                  className="hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Twitter />
                </a>
              </li>
              <li>
                {' '}
                <a
                  title="Follow on GitHub"
                  href="https://github.com/benazeem/obsidianplus"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:underline"
                >
                  <Github />
                </a>
              </li>
            </ul>
          </div>
          <div className="w-1/2">
            <h3 className="font-semibold mb-2">Developer</h3>
            <ul className="space-y-1">
              <li>Created by: Mohd Azeem Malik</li>
              <li>
                GitHub:&nbsp;
                <a
                  href="https://github.com/benazeem"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:underline"
                >
                  benazeem
                </a>
              </li>
              <li>
                Email:&nbsp;
                <a
                  href="mailto:azeemkhandsari@gmail.com"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:underline"
                >
                  azeemkhandsari
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-2 w-full flex items-center justify-between text-center text-base text-purple-200">
        <Link to="/privacy-policy" className="hover:underline text-sm">
          Privacy Policy
        </Link>
        <p className="hidden md:block">
          &copy; {new Date().getFullYear()} Obsidian Plus. All rights reserved.
        </p>
        <Link to="/terms-of-service" className="hover:underline text-sm">
          Terms of Service
        </Link>
      </div>
      <p className="md:hidden inset-0">
        &copy; {new Date().getFullYear()} Obsidian Plus. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
