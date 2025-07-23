import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="max-h-[10dvh] w-full fixed  flex items-center justify-between bg-purple-700/20 backdrop-blur-md text-white text-[calc(10px+2vmin)] p-2 shadow-lg z-50">
      <div className="flex">
        <Link to="/" className="flex items-center">
          <img
            src="/icon.ico"
            className="logo w-10"
            alt="Obsidian+ logo"
            draggable="false"
          />
          <h5 className="ml-2">Obsidian+ Web Clipper</h5>
        </Link>
      </div>
    </header>
  )
}
