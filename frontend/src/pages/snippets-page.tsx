import { useQuery } from "@tanstack/react-query"
import axios from '../lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Tag, X, Search } from "lucide-react";
import { useLocalStorage } from 'usehooks-ts'
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import SnippetCard from "@/components/SnippetCard";

type Snippet = {
    id: string;
    createdAt: Date;
    title: string;
    language: string;
    code: string;
    userId: number;
  }
  

export default function SnippetsPage() {

    const [selectedLang, setSelectedLang] = useLocalStorage<number | null>('lang-snippets', null)
    const [searchQuery, setSearchQuery] = useState('')

    const {data: snippets, isLoading, isError} = useQuery<Snippet[]>({
        queryKey: ['getSnippets'],
        queryFn: async () => {
            try {
                const { data: { snippets }} = await axios.get('/api/snippet/getSnippets', { withCredentials: true})
                return snippets
            } catch(err) {
                 console.error(err)
                 throw new Error('Error fetching snippets')
            }
        },
        refetchInterval: 1000 * 60 * 10
    })

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>error</p>
    if(snippets && snippets.length === 0) return <p>No snippets found</p>

    const languages = [...new Set(snippets?.map(snippet => snippet.language).slice(0,5))]

    const filteredSnippets = snippets

  return <div className="w-full min-h-screen bg-[#0a0a0f] flex flex-col items-center p-2 gap-5">
             <div className="flex flex-col items-center gap-7 mt-5">
                <motion.span  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{duration: 0.3, ease: 'easeInOut'}}
                 className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full text-gray-400 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <BookOpen className="w-4 h-4" />
                    Community Code Library
                </motion.span>
                <motion.h1  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}  transition={{ delay: 0.1, duration: 0.3, ease: 'easeInOut' }}
                className="bg-gradient-to-r from-blue-100 to-blue-600 text-transparent bg-clip-text font-bold text-6xl ">
                    Discover & Share Code Snippets
                </motion.h1>
                <motion.p initial={{ opacity: 0 }}  animate={{ opacity: 1 }} transition={{duration: 0.3, delay: 0.2, ease: 'easeInOut'}}
                 className="text-lg text-gray-400">
                  Explore a curated collection of code snippets from the community
                </motion.p>
             </div>
             
             <section className="w-[60%] flex flex-col">
                 <div id="search" className="relative group mb-5 p-3 rounded-xl flex items-center gap-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                    <Search className="size-5" strokeWidth={2}/>
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                     className="bg-transparent placeholder:text-gray-500 z-10 grow focus:outline-none placeholder:text-sm" placeholder="Search snippets by title, language or author..."/>
                 </div>

                 <div className="flex flex-wrap items-center justify-between p-1 text-sm">
                      
                     <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 px-4 py-2 rounded-lg ring-1 ring-gray-800 bg-[#1e1e2e]">
                            <Tag className="size-4 text-gray-400"/>
                            <span className="text-gray-400">Languages:</span>
                         </div>
                         {languages.map((lang,i) => {
                             return <button onClick={() => setSelectedLang(i)} key={i} 
                                className={twMerge("px-3 py-1.5 rounded-lg group transition-all border-2 duration-200 flex items-center gap-2",
                                    selectedLang === i ? 'text-blue-400 bg-blue-500/10 border-blue-500/50' : 'text-gray-400 bg-[#1e1e2e] border-transparent hover:text-gray-300 hover:bg-[#262637] ring-1 ring-gray-800'
                                )}>
                                <img src={`/${lang.toLowerCase()}.png`} alt="lang" className="size-4 object-contain"/>
                                  {lang}
                             </button>
                         })}

                         {(selectedLang !== null) && (
                             <button onClick={() => setSelectedLang(null)} className="flex items-center border rounded-md gap-2 px-2 py-1 text-gray-400 hover:text-gray-300 transition-colors">
                                <X className="size-4" />
                                Clear
                             </button>
                         )}
                     </div>

                 </div>
             </section>
             <motion.div layout id="snippets" className="grid grid-cols-3 gap-4 p-2 w-3/4">
              <AnimatePresence mode="popLayout">
                {filteredSnippets?.map(snippet => {
                    return <SnippetCard key={snippet.id}  snippet={snippet}/>
                })}      
               </AnimatePresence>
            </motion.div>

  </div>
}