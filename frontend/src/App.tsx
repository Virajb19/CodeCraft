import { Route, Routes, Navigate } from 'react-router-dom'
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

function App() {

    const { user } = useAuth()
    const isAuth = !!user

    console.log(isAuth)

  return (
      <div className='w-full min-h-screen'>
          <Toaster richColors position='bottom-right' theme='dark'/>
          <NextTopLoader height={5} color="#38bdf8" showSpinner={false} easing="ease"/>
          {/* <BackgroundBeams className='-z-50'/> */}

          <Routes>
              <Route path='/' element={isAuth ? <Navigate to={'/editor'}/> : <HomePage />}/>
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
 