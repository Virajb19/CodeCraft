import ProfileHeader from "@/components/ProfileHeader";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Clock, Code, ListVideo, Loader, Loader2, Star } from "lucide-react";
import axios, { Execution, Snippet } from "../lib/utils";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from 'framer-motion'
import CodeBlock from "@/components/CodeBlock";
import SnippetCard from "@/components/SnippetCard";

async function fetchExecutions() {
   try {
     const { data: { executions, executionsInLast24hrs }} = await axios.get('/api/codeExecution/getExecutions', { withCredentials: true})
    //  await new Promise(r => setTimeout(r,5000))
     return { executions, executionsInLast24hrs }
   } catch(err) {
      console.error(err)
      return { executions: [], executionsInLast24hrs: 0 };
   }
}

async function fetchStarredSnippets() {
    try {
      const {data: { starredSnippets }} = await axios.get('/api/snippet/getStarredSnippets', { withCredentials: true})
      // await new Promise(r => setTimeout(r,5000))
      return starredSnippets
    } catch(err) {
        console.error(err)
    }
}

const TABS = [
  {
    id: "executions",
    label: "Code Executions",
    icon: ListVideo,
  },
  {
    id: "starred",
    label: "Starred Snippets",
    icon: Star,
  },
]


export default function Profile() {

    const [activeTab,setActiveTab] = useState<'executions' | 'starred'>('executions')

    // Give activeTab as queryKey
    const {data: executionsData, isLoading: loadingExecutions} = useQuery<{executions: Execution[], executionsInLast24hrs: number}>({queryKey: ['getExecutions'], queryFn: fetchExecutions})
    const {data: starredSnippets, isLoading: loadingSnippets} = useQuery<Snippet[]>({queryKey: ['getStarredSnippets'], queryFn: fetchStarredSnippets})

    // const executionsInLast24hrs = useMemo(() => {
    //     executionsData?.executions.filter(execution => execution.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)).length
    // }, [executionsData?.executions])

    //   const starredLanguages = [...new Set(starredSnippets?.map(snippet => snippet.language))]
    const userStats = useMemo(() => {
           
      const totalExecutions = executionsData?.executions.length ?? 0
      const languagesCount = new Set(executionsData?.executions.map(execution => execution.language)).size ?? 0;

      const languageStats = executionsData?.executions.reduce(
          (acc, curr) => {
            acc[curr.language] = (acc[curr.language] || 0) + 1
            return acc;
          },
          {} as Record<string, number>
        ) ?? {}

        const languages = Object.keys(languageStats)

        const favoriteLanguage = languages.length ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b)) : "N/A"


      const starredLanguages = starredSnippets?.reduce((acc, snippet) => {
          const language = snippet.language
          acc[language] = (acc[language] || 0) + 1
          return acc
        }, {} as Record<string, number>) ?? {}

        const mostStarredLanguage = Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A"

        return  {
          totalExecutions,
          languagesCount,
          last24Hours: executionsData?.executionsInLast24hrs ?? 0,
          languageStats,
          languages,
          favoriteLanguage,
          mostStarredLanguage,
          starredSnippets: starredSnippets?.length ?? 0,
      }
}, [executionsData, starredSnippets])

    // if(loadingExecutions || loadingSnippets) return <div className="w-full min-h-screen flex-center">
    //    <Loader className="size-40 animate-spin text-blue-600"/>
    // </div>
    

  return <div className="w-full flex flex-col items-center min-h-screen py-8 px-4">
         <ProfileHeader userStats={userStats}/> 

         <div id="content" className="flex flex-col min-h-[50vh] p-4 gap-1 mt-5 w-4/5 bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-2xl shadow-2xl shadow-black/50 border border-gray-800/50 backdrop-blur-xl">
               <div id="tabs" className="flex items-center gap-4">
                  {TABS.map(tab => {
                    return <button key={tab.id} onClick={() => setActiveTab(tab.id as 'executions' | 'starred')}
                     className={twMerge('flex items-center relative  gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 overflow-hidden', activeTab === tab.id ? 'text-blue-400 border-transparent' : 'text-gray-400 border-gray-500/10 hover:text-gray-300')}>
                         <tab.icon className="size-4"/>
                         <span className="font-semibold text-sm">{tab.label}</span>

                         {activeTab === tab.id && (
                           <motion.div layoutId="activeTab" transition={{type: 'spring', bounce: 0.2, duration: 0.6}}
                            className="absolute inset-0 bg-blue-500/10 rounded-lg -z-10" />
                         )}
                    </button>
                  })}
               </div>

               <div className="h-[2px] rounded-full my-3 bg-gray-700"/>

               <AnimatePresence mode="wait">
                    <motion.div className="p-6 mx-10" key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}  exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                       
                       {activeTab === 'executions' && (
                        <>
                         <div className="flex flex-col gap-3">
                              {executionsData?.executions.map(execution => {
                                return <div key={execution.id} className="group border border-transparent transition-all duration-300 rounded-xl hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/50">
                                      <div id="header" className="flex gap-3 p-4 relative bg-black/30 border border-gray-800/50 rounded-t-xl">
                                          
                                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"/>
                                           
                                           <img src={`/${execution.language.toLowerCase()}.png`} className="size-14 rounded-xl"/>
                                           <div className="flex flex-col gap-1">
                                              <div className="flex items-center gap-2">
                                                  <span className="uppercase font-bold">{execution.language}</span>
                                                   <span className="text-sm text-gray-400">•</span>
                                                   <span className="text-sm text-gray-400">{new Date(execution.createdAt).toLocaleString()}</span>
                                              </div>
                                                <span className={twMerge('text-sm w-fit px-2 py-0.5 rounded-full', execution.error ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400')}>
                                                   {execution.error ? 'Error' : 'Success'}
                                                </span>
                                           </div>
                                      </div>

                                      <div id="code" className="p-4 rounded-b-xl bg-black/20">
                                           <CodeBlock code={execution.code} language={execution.language}/>

                                           {(execution.error || execution.output) && (
                                             <div className="bg-black/40 mt-4 p-4 rounded-lg">
                                                 <h4 className="text-lg mb-2">Output</h4>
                                                 <pre className={twMerge("line-clamp-5", execution.error ? 'text-red-400' : 'text-green-400')}>
                                                  {execution.error || execution.output}
                                                 </pre>
                                             </div>
                                           )}
                                      </div>
                                </div>
                              })}
                         </div>

                         {loadingExecutions ? (
                          <div className="grow flex-center gap-3 py-20">
                               <Loader2 className="size-12 text-gray-600 animate-spin"/>
                               <h2 className="text-4xl font-semibold">Loading code executions...</h2>
                          </div>
                       ) : (
                         executionsData?.executions.length === 0 && (
                           <div className="grow flex-center flex-col gap-1">
                               <div className="flex items-center gap-2">
                                  <Code className="size-12 text-gray-600"/>
                                  <h2 className="font-semibold text-3xl">No code executions yet</h2>
                               </div>
                               <p className="text-gray-500">Start coding to see your execution history!</p>
                           </div>
                         )
                       )}

                         </>
                       )}

                       {activeTab === 'starred' && (
                        <>

                      {loadingSnippets ? (
                          <div className="grow flex-center gap-3 py-20">
                               <Loader2 className="size-12 text-gray-600 animate-spin"/>
                               <h2 className="text-4xl font-semibold">Loading starred snippets...</h2>
                          </div>
                       ) : (
                         starredSnippets?.length === 0 ? (
                           <div className="grow flex-center flex-col gap-1">
                               <div className="flex items-center gap-2">
                                  <Code className="size-12 text-gray-600"/>
                                  <h2 className="font-semibold text-3xl">No starred snippets yet</h2>
                               </div>
                               <p className="text-gray-500">Start exploring and star the snippets you find useful!</p>
                           </div>
                         ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {starredSnippets?.map(snippet => {
                              return <div key={snippet.id} className="relative group">
                                      <SnippetCard snippet={snippet}/>
                              </div>
                            })}
                        </div>

                         )
                       )}                    
                         </>
                       )}                       

                    </motion.div>
               </AnimatePresence>
         </div>
  </div>
}