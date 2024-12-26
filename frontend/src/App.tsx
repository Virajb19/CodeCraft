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

function App() {

    const { user } = useAuth()
    const isAuth = !!user

  return (
      <div className='w-full min-h-screen'>
          <Toaster richColors position='bottom-right' theme='dark'/>
          <NextTopLoader height={5} color="#38bdf8" showSpinner={false} easing="ease"/>

          <Routes>
              <Route path='/' element={<HomePage />}/>
              <Route path='/editor' element={isAuth ? <EditorPage /> : <Navigate to={'/'}/>} />
              <Route path='/snippets' element={isAuth ? <SnippetsPage /> : <Navigate to={'/'}/>}/>
              <Route path='/snippet/:id' element={isAuth ? <Snippet /> : <Navigate to={'/'}/>}/>
              <Route path='/profile' element={isAuth ? <Profile /> : <Navigate to={'/'}/>}/>
              <Route path='*' element={<NotFound />} />
          </Routes>
      </div>
  )
}

export default App
 