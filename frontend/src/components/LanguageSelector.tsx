import { LANGUAGE_CONFIG } from "@/constants";
import { useCodeEditorStore } from "@/lib/store"
import { useAuth } from "@/lib/useAuth";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, Lock, Sparkles } from 'lucide-react'
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

export default function LanguageSelector() {
  
  const { language, setLanguage } = useCodeEditorStore()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const currentLanguageObj = LANGUAGE_CONFIG[language.toLowerCase()]

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLanguageSelect(langId: string) {
    if(!user?.isPro && (langId != 'javascript')) return

    setLanguage(langId)
    setIsOpen(false)
  }

  return <div ref={dropdownRef} className="relative">
          <button onClick={() => setIsOpen(!isOpen)}
           className='group relative flex items-center gap-3 px-2 py-2 bg-[#1e1e2e]/80 rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700'>
                 
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                />

               <div className="p-1 rounded-lg bg-gray-800/50 group-hover:scale-110 transition-transform">
                <img src={`/${language.toLowerCase()}.png`} width={30} height={20} className="rounded-lg z-10 object-contain"/>
               </div>

                <span className="text-gray-400 min-w-[100px] capitalize text-left group-hover:text-white transition-colors">
                   {currentLanguageObj.label} 
                </span>

                <ChevronDownIcon className={twMerge('text-gray-400 transition-all duration-300 group-hover:text-gray-300',
                    isOpen && 'rotate-180' 
                )}/>
          </button>

          <AnimatePresence>
              {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="absolute top-full max-h-[210px] flex flex-col gap-2 overflow-y-scroll inset-x-0 z-[200] p-2 w-63 mt-2 bg-[#1e1e2e]/95 backdrop-blur-xl rounded-xl border border-[#313244] shadow-2xl">
                       {Object.values(LANGUAGE_CONFIG).map((lang, i) => {

                         const isLocked = !user?.isPro && (lang.id !== 'javascript')

                         return <motion.button disabled={isLocked} onClick={() => handleLanguageSelect(lang.id)} key={lang.id} initial={{opacity: 0 }} animate={{opacity: 1 }}  transition={{ delay: i * 0.2, ease: 'easeInOut' }}
                         className={twMerge('flex relative group items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70',
                            language === lang.id ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300'
                         )}>

                         {lang.id !== language && (
                               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                               />
                         )}

                    <div className="flex items-center gap-1.5">
                          <div id="img" className={twMerge('size-8 p-1 rounded-lg group-hover:scale-110 transition-transform', lang.id === language ? 'bg-blue-500/10' : 'bg-gray-800/50')}>
                            
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                           />                      
                               <img src={`/${lang.id.toLowerCase()}.png`} width={30} height={20} className="rounded-lg z-10 object-contain"/>
                            </div>
   
                             <span className="text-left hover:text-white text-gray-400">{lang.label}</span>
                      </div>

                          {lang.id === language && (
                               <motion.div initial={{y: -5}} animate={{ y: 0}} transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.3, delay: 0.2}}
                               className="absolute inset-0 border-[3px] border-blue-500/30 rounded-md"/>   
                          )}

                          {isLocked ? (
                              <Lock />
                          ) : (
                             lang.id === language && <Sparkles className="text-amber-300 fill-yellow-400"/>
                          )}

                         </motion.button>
                       })}
                </motion.div>
              )}
          </AnimatePresence>
  </div>
}