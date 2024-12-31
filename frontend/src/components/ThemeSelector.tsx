import { CircleOff, Cloud, Laptop, Moon, Palette, Sun } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { THEMES } from '../constants'
import { useCodeEditorStore } from "../lib/store";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence} from 'framer-motion'
import { toast } from "sonner";


const THEME_ICONS: Record<string, React.ReactNode> = {
    "vs-dark": <Moon className="size-5" strokeWidth={3}/>,
    "vs-light": <Sun className="size-5"  strokeWidth={3} />,
    "github-dark": <LuGithub className="size-5" strokeWidth={3}/>,
     monokai: <Laptop className="size-5" strokeWidth={3}/>,
    "solarized-dark": <Cloud className="size-5"  strokeWidth={3}/>,
  };
  

export default function ThemeSelector() {

const { theme, setTheme } = useCodeEditorStore()
const [isOpen, setIsOpen] = useState(false)

const currentTheme = THEMES.find(t => t.id === theme)

const dropdownRef = useRef<HTMLDivElement>(null)

// toast.success(isOpen)

  // return <Select onValueChange={val => setTheme(val)}>
  //         <SelectTrigger className='w-[200px] outline-none'>
  //             <SelectValue placeholder='Select a theme'/>
  //             </SelectTrigger>
  //             <SelectContent>
  //                 {THEMES.map(t => {
  //                     return <SelectItem key={t.id} value={t.id} className="">
  //                         <div className={twMerge("flex items-center gap-2 px-3 py-2.5 transition-all duration-200", theme === t.id ? 'text-blue-400' : 'text-gray-300')}>
  //                           {THEME_ICONS[t.id]} {t.label}
  //                         </div>
  //                     </SelectItem>
  //                 })}
  //             </SelectContent>
  //       </Select>   

  useEffect(() => {

    const handleClickOutside = (e: MouseEvent) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return <div ref={dropdownRef} className="relative">
       <button onClick={() => setIsOpen(!isOpen)} 
        className="group relative rounded-lg overflow-hidden flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 hover:bg-[#262637] transition-all duration-200 border border-gray-800/50 hover:border-gray-700">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"/>
         <Palette className="text-gray-400 group-hover:text-gray-300 transition-colors"/>
         <span className="min-w-[120px] text-left text-gray-400 group-hover:text-white transition-colors">{currentTheme?.label}</span>
         <div style={{backgroundColor: currentTheme?.color}} className="size-4 rounded-full border border-gray-600 group-hover:border-gray-500 transition-colors"/>
       </button>

        <AnimatePresence>
          {isOpen && (
               <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
               className="absolute inset-x-0 top-full mt-2 flex flex-col bg-[#1e1e2e]/95 py-2 px-1 gap-1 rounded-lg z-[200] backdrop-blur-xl border border-[#313244] shadow-2xl">
                   <div className="border-b-[3px] text-lg mx-2 mb-3 text-center border-gray-800 text-gray-400 font-semibold">
                      Select Theme
                   </div>
                  {THEMES.map((t,idx) => {
                     return <motion.button onClick={() => {
                      setTheme(t.id)
                      // setIsOpen(false)
                     }} key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{duration: 0.3, delay: idx * 0.1}}
                      className={twMerge("border relative group flex items-center justify-between gap-3 px-3 py-2.5 rounded-md transition-colors duration-200", theme === t.id ? 'bg-blue-500/10 text-blue-400 border-transparent' : 'text-gray-300 hover:bg-[#262637] hover:border-transparent border-gray-600/30')}>
                        {t.id !== theme && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"/>}
                          
                           <div className="flex items-center gap-2">
                              {THEME_ICONS[t.id] || <CircleOff className="size-5"/>}
                              <span className="text-left">{t.label}</span>
                           </div>

                           <div style={{backgroundColor: t.color}} className="size-4 rounded-full border border-gray-600 group-hover:border-gray-500 transition-colors"/>
                           
                           {/* layoutId="border" */}
                           {theme === t.id && (
                             <motion.div initial={{y: -5}} animate={{ y: 0}} transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.3, delay: 0.2}}
                              className="absolute inset-0 border-2 border-blue-500/30 rounded-md"/>
                           )}
                     </motion.button>
                  })}
             </motion.div>   
          )}
        </AnimatePresence>
  </div>
}