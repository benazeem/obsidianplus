import { Outlet } from '@tanstack/react-router'
import Footer from './components/Footer'
import Header from './components/Header' 

function App() {
  return (
    <>
      <Header />
      <div className="text-center bg-gradient-from-l from-purple-900 bg-gradient-to-br to-purple-500">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default App
