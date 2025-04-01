import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
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
import RoomPage from './pages/RoomPage';
import { Loader } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts'
import DesktopOnly from './pages/DesktopOnly';
import Navbar from './components/Navbar';
import GridPattern from './components/GridPattern';
import { useEffect } from 'react';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

export default function App() {

    const { user, isLoading } = useAuth()
    const isAuth = !!user

    // toast.success(isAuth ? 'Auth' : 'Not')

    const { pathname } = useLocation()
    const isSmallScreen = useMediaQuery('(max-width: 1280px)')
    const navigate = useNavigate()

    useEffect(() => {
        if(isSmallScreen) navigate('/desktop-only')
    }, [isSmallScreen, pathname,navigate])


    if(isLoading && pathname != '/') return <div className='w-full min-h-screen flex-center bg-black'>
       <Loader className='size-20 animate-spin text-blue-600'/>
    </div>

  return (
      <div className='w-full min-h-screen bg-gradient-to-r from-blue-500/20 to-purple-500/20'>
          <Toaster richColors position='bottom-right' theme='dark'/>
          <NextTopLoader height={5} color="#38bdf8" showSpinner={false} easing="ease"/>
          {/* {!pathname.includes('/room') && <BackgroundBeams className='-z-50'/>} */}
          <GridPattern />

          {/* {pathname !== '/desktop-only' && <Navbar />} */}
          <Navbar />

          <Routes>
              <Route path='/' element={<HomePage />}/>
              <Route path='/signup' element={!isAuth ? <SignUp /> : <Navigate to={'/editor'}/>}/>
              <Route path='/signin' element={!isAuth ? <SignIn /> : <Navigate to={'/editor'}/>}/>
              <Route path='/editor' element={isAuth ? <EditorPage /> : <Navigate to={'/'}/>} />
              <Route path='/snippets' element={isAuth ? <SnippetsPage /> : <Navigate to={'/'}/>}/>
              <Route path='/snippet/:id' element={isAuth ? <Snippet /> : <Navigate to={'/'}/>}/>
              <Route path='/profile' element={isAuth ? <Profile /> : <Navigate to={'/'}/>}/>
              <Route path='/room/:id' element={isAuth ? <RoomPage /> : <Navigate to={'/'}/>}/>
              <Route path='/desktop-only' element={isSmallScreen ? <DesktopOnly /> : <Navigate to={'/'}/>}/>
              <Route path='*' element={<NotFound />} />
          </Routes>
      </div>
  )
}
 