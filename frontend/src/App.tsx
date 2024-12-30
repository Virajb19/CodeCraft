import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import EditorPage from './pages/editor-page'
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner'
import SnippetsPage from './pages/snippets-page';
import Snippet from './pages/Snippet';
import HomePage from './pages/HomePage';
import './index.css'
import { useAuth } from './lib/useAuth';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import { BackgroundBeams } from './components/ui/background-beams';
import RoomPage from './pages/RoomPage';
import { Loader } from 'lucide-react';

function App() {

    const { user, isLoading } = useAuth()
    const isAuth = !!user

    const { pathname } = useLocation()

    if(isLoading && pathname != '/') return <div className='w-full min-h-screen flex-center'>
       <Loader className='size-20 animate-spin text-blue-600'/>
    </div>

  return (
      <div className='w-full min-h-screen'>
          <Toaster richColors position='bottom-right' theme='dark'/>
          <NextTopLoader height={5} color="#38bdf8" showSpinner={false} easing="ease"/>
          {!pathname.includes('/room') && <BackgroundBeams className='-z-50'/>}

          <Routes>
              <Route path='/' element={<HomePage />}/>
              <Route path='/editor' element={isAuth ? <EditorPage /> : <Navigate to={'/'}/>} />
              <Route path='/snippets' element={isAuth ? <SnippetsPage /> : <Navigate to={'/'}/>}/>
              <Route path='/snippet/:id' element={isAuth ? <Snippet /> : <Navigate to={'/'}/>}/>
              <Route path='/profile' element={isAuth ? <Profile /> : <Navigate to={'/'}/>}/>
              <Route path='/room/:id' element={isAuth ? <RoomPage /> : <Navigate to={'/'}/>}/>
              <Route path='*' element={<NotFound />} />
          </Routes>
      </div>
  )
}

export default App
 