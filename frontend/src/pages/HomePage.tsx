import { Card, CardContent, CardTitle, CardHeader} from '../components/ui/card'
import { FaGithub } from "react-icons/fa";
import { useAuth } from '@/lib/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight} from 'lucide-react'
import { FcGoogle } from "react-icons/fc";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL as string

export default function HomePage() {

    const { user, isLoading} = useAuth()
    const isAuth = !!user

  return <div className="w-full min-h-screen flex-center bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <Card className='z-10'>
                <CardHeader>
                     <CardTitle className='text-5xl'>Welcome to <span className='bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text'>CodeCraft</span></CardTitle>
                </CardHeader>
                  <CardContent>
                     {isLoading ? <Skeleton className='h-14'/> : (
                             isAuth ? <Link to={'/editor'} className='group w-full flex-center gap-3 text-lg p-4 bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 
						               focus:outline-none focus:ring-[#24292F]/50 font-semibold rounded-lg'>
                                Go to Editor <ArrowRight className='group-hover:translate-x-3 duration-200'/>
                             </Link>
                             : (
                               <div className='flex flex-col gap-2'>

                                 <Link target='_self' to={`${BACKEND_URL}/api/auth/github`} className='w-full flex-center gap-3 p-4 bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 
						                   focus:outline-none focus:ring-[#24292F]/50 font-semibold rounded-lg text-lg'>
                                       <FaGithub className='size-7'/>
                                       Login with Github
                               </Link>
                            {/* 
                               <button onClick={async () => {
                                await signIn.social({provider: 'github', callbackURL: '/'})
                               }} className='w-full flex-center gap-3 p-4 bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 
						                   focus:outline-none focus:ring-[#24292F]/50 font-semibold rounded-lg text-lg'>
                                       <FaGithub className='size-7'/>
                                       Login with Github
                               </button> */}

                                    <button onClick={() => {
                                        window.open(`${BACKEND_URL}/api/auth/google/callback`, "_self")
                                    }} className='gap-3 p-4 flex-center text-lg bg-white rounded-lg text-black font-semibold hover:opacity-80 duration-200'>
                                       <FcGoogle className='size-7'/>
                                          Login with Google
                                    </button>
                                  {/* 
                                    <Link to={'/signin'} className='flex-center gap-3 group text-lg mt-3 text-blue-400 '>
                                       <ArrowLeft className='group-hover:-translate-x-1 duration-300'/> Signin using Email
                                    </Link> */}
                               </div>
                             )
                     )}
                  </CardContent>
            </Card>
  </div>
}