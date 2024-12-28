import { CircleOff, Cloud, Laptop, Moon, Palette, Sun } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { THEMES } from '../constants'
import { useCodeEditorStore } from "../lib/store";
import { twMerge } from "tailwind-merge";


const THEME_ICONS: Record<string, React.ReactNode> = {
    "vs-dark": <Moon className="size-4" />,
    "vs-light": <Sun className="size-4" />,
    "github-dark": <LuGithub className="size-4" />,
     monokai: <Laptop className="size-4" />,
    "solarized-dark": <Cloud className="size-4" />,
  };
  

export default function ThemeSelector() {

const { theme, setTheme } = useCodeEditorStore()

  return <Select onValueChange={val => setTheme(val)}>
          <SelectTrigger className='w-[200px] outline-none'>
              <SelectValue placeholder='Select a theme'/>
              </SelectTrigger>
              <SelectContent>
                  {THEMES.map(t => {
                      return <SelectItem key={t.id} value={t.id} className="">
                          <div className={twMerge("flex items-center gap-2 px-3 py-2.5 hover:bg-[#262637] transition-all duration-200", theme === t.id ? 'text-blue-400' : 'text-gray-300')}>
                            {THEME_ICONS[t.id]} {t.label}
                          </div>
                      </SelectItem>
                  })}
              </SelectContent>
        </Select>   
}