import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import './index.css'
import HomePage from './pages/home-page'
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner'

function App() {

  return (
      <div className='w-full min-h-screen'>
          <Navbar />
          <Toaster richColors position='bottom-right' theme='dark'/>
          <NextTopLoader height={5} color="#38bdf8" showSpinner={false} easing="ease"/>
          <Routes>
              <Route path='/' element={<HomePage />} />
          </Routes>
      </div>
  )
}

export default App
 