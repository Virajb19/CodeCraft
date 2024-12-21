import { CircleOff, Cloud, Laptop, Moon, Palette, Sun } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { THEMES } from '../constants'
import { useCodeEditorStore } from "../lib/store";


const THEME_ICONS: Record<string, React.ReactNode> = {
    "vs-dark": <Moon className="size-4" />,
    "vs-light": <Sun className="size-4" />,
    "github-dark": <LuGithub className="size-4" />,
     monokai: <Laptop className="size-4" />,
    "solarized-dark": <Cloud className="size-4" />,
  };
  

export default function ThemeSelector() {

const { theme, setTheme } = useCodeEditorStore()

  return <div className="">
      <Select onValueChange={val => setTheme(val)}>
        <SelectTrigger className='w-[300px] outline-none'>
            <SelectValue placeholder='Select a theme'/>
            </SelectTrigger>
             <SelectContent>
                 {THEMES.map(theme => {
                    return <SelectItem key={theme.id} value={theme.id} className="">
                         <div className="flex items-center gap-2">
                           {THEME_ICONS[theme.id]} {theme.label}
                         </div>
                    </SelectItem>
                 })}
             </SelectContent>
        </Select>   
  </div>
}