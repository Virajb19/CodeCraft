import { BackgroundBeams } from '@/components/ui/background-beams'
import { Card, CardContent, CardTitle, CardHeader} from '../components/ui/card'
import { FaGithub } from "react-icons/fa";
import { useAuth } from '@/lib/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight} from 'lucide-react'

export default function HomePage() {

    const { user, isLoading} = useAuth()

  return <div className="w-full min-h-screen flex-center bg-gradient-to-r from-blue-500/10 to-purple-500/10">
       <BackgroundBeams />
            <Card className='z-10'>
                <CardHeader>
                     <CardTitle className='text-5xl'>Welcome to <span className='bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text'>CodeCraft</span></CardTitle>
                </CardHeader>
                  <CardContent>
                     {isLoading ? <Skeleton className='h-14'/> : (
                       <div className='bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 
						             focus:outline-none focus:ring-[#24292F]/50 font-semibold rounded-lg text-lg'>
                          {
                             user ? <Link to={'/editor'} className='group w-full flex-center gap-3 text-lg p-4'>
                                Go to Editor <ArrowRight className='group-hover:translate-x-3 duration-200'/>
                             </Link>
                             : <button onClick={() => {
                                 window.open('http://localhost:3000/api/auth/github', "_self")
                             }} className='w-full flex-center gap-3 p-4'>
                              <FaGithub className='size-7'/>
                              Login to your account
                             </button>
                          }
                       </div>
                     )}
                  </CardContent>
            </Card>
  </div>
}