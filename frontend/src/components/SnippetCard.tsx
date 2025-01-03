import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Trash2, User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/utils';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useAuth } from '@/lib/useAuth';
import StarButton from './StarButton';
import { Snippet } from '../lib/utils'

export default function SnippetCard({snippet} : {snippet: Snippet}) {

  const { user } = useAuth()

  const queryClient = useQueryClient()

  const {mutateAsync: deleteSnippet, isPending} = useMutation({
    mutationKey: ['deleteSnippet'],
    mutationFn: async (id: string) => {
       const { data: { msg } } = await axios.delete(`/api/snippet/delete/${id}`, { withCredentials: true}) 
       return msg
    },
    onSuccess: () => {
       toast.success('Snippet deleted successfully')
    },
    onError: (err) => {
       console.error(err)
       if(err instanceof AxiosError) {
        toast.error(err.response?.data.msg || 'Failed to delete snippet!')
       }
    }
  })

  return <motion.div layout initial={{y: 3, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.2, ease: 'easeInOut'}}
       className="group relative rounded-xl hover:-translate-y-2 hover:shadow-md hover:shadow-blue-600 transition-all duration-300">
        <Link to={`/snippet/${snippet.id}`}>
          <div className='flex flex-col gap-3 p-3 border border-[#313244]/50 hover:border-[#313244] transition-all duration-200 bg-[#1e1e2e]/80 rounded-xl backdrop-blur-sm overflow-hidden'>
              <div id='header' className='flex items-center justify-between'>
                  <div className='flex items-start gap-2'>
                      <div id='image' className='relative group p-3'>
                           <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-all duration-500'/>
                           <img src={`/${snippet.language.toLowerCase()}.png`} className='size-6 object-contain'/>
                      </div>
                      <div className='flex flex-col gap-1'>
                           <span className='bg-blue-500/10 text-blue-400 rounded-lg text-sm font-semibold px-3 py-1 w-fit'>{snippet.language}</span>
                           <span className='flex-center gap-1 text-xs text-gray-500'><Clock className='size-4 text-white' strokeWidth={3}/>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                      </div>
                  </div>
                    
                    <div className='flex items-center gap-2'>

                       <StarButton snippetId={snippet.id}/>

                       {snippet.userId == user?.id && (
                            <button disabled={isPending} onClick={async (e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              await deleteSnippet(snippet.id)
                              queryClient.refetchQueries({ queryKey: ['getSnippets']})
                              queryClient.refetchQueries({ queryKey: ['getStarredSnippets']})
                            }}
                            className='disabled:bg-red-500/20 disabled:text-red-400 disabled:cursor-not-allowed bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 px-3 py-1.5 rounded-lg duration-200 transition-all'>
                            {isPending ? (
                              <div className="size-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="size-5" /> 
                            )}
                          </button>
                       )}
                    </div>
              </div>

              <div id='content' className='flex flex-col gap-2'>
                 <h2 className='text-xl line-clamp-1 group-hover:text-blue-400 transition-colors'>{snippet.title}</h2>
                  <div className='flex items-center gap-2'>
                    <span className='p-2 rounded-full bg-gray-800/50'><User className='size-4'/></span>
                    <span className='truncate max-w-[150px] text-sm text-gray-400'>{user?.name || 'user'}</span>
                  </div>

                  <div className='relative group/code'>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-all" />
                    <pre className='bg-black/30 rounded-lg p-4 overflow-hidden text-sm text-gray-300 font-mono line-clamp-4'>{snippet.code}</pre>
                  </div>
              </div>
          </div>
        </Link>  
  </motion.div>
}