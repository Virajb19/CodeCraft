import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, User } from 'lucide-react';

type Snippet = {
    id: string;
    createdAt: Date;
    title: string;
    language: string;
    code: string;
    userId: number;
  }
  
export default function SnippetCard({snippet} : {snippet: Snippet}) {
  return <motion.div layout className="group rounded-xl hover:-translate-y-2 hover:shadow-md hover:shadow-blue-600 transition-all duration-300">
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
                     
                    </div>
              </div>

              <div id='content' className='flex flex-col gap-2'>
                 <h2 className='text-xl line-clamp-1 group-hover:text-blue-400 transition-colors'>{snippet.title}</h2>
                  <div className='flex items-center gap-2'>
                    <span className='p-2 rounded-full bg-gray-800/50'><User className='size-4'/></span>
                    <span className='truncate max-w-[150px] text-sm text-gray-400'>{'Virajb19'}</span>
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