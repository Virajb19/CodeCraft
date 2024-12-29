import { Blocks, Code2 } from 'lucide-react';
import { Select, SelectContent, SelectValue, SelectItem, SelectTrigger } from './ui/select';
import { useCodeEditorStore } from '@/lib/store';
import ThemeSelector from './ThemeSelector';
import RunButton from './run-button';
import { Link } from 'react-router-dom'
import UserAccountNav from './UserAccountNav';
import CreateRoomButton from './CreateRoomButton';

export default function Navbar() {

  const { setLanguage } = useCodeEditorStore()

  return <nav className="fixed inset-x-0 top-0 flex gap-3 items-center justify-between backdrop-blur-md z-40 p-4 bg-[#0a0a0f]/80 border-b border-gray-600">
       <div className='flex items-center gap-3'>
       <div className='flex gap-3 items-center group'>
          <span>
              <Blocks className='size-10 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500'/>
          </span>
          <div className="flex flex-col">
              <span className="block text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text">
                CodeCraft
              </span>
              <span className="block text-sm text-blue-400/60 font-medium">
                Interactive Code Editor
              </span>
            </div>
       </div>
       <div className="flex items-center gap-5">
            <Link to={'/snippets'}
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
                hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10
                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-5 transition-transform" />
              <span
                className="text-lg font-medium group-hover:text-white
                 transition-colors"
              >
                Snippets
              </span>
            </Link>
          </div>

          <CreateRoomButton />
      </div>
          
          <div className='flex items-center gap-2'>
            <Select onValueChange={val => setLanguage(val)}>
                    <SelectTrigger className='w-[200px] outline-none'>
                        <SelectValue placeholder='Select a language'/>
                    </SelectTrigger>
                    <SelectContent>
                    {["JavaScript", "Python", "Java", "Cpp", "Csharp", "Ruby", "Swift", "Go", "Rust", "TypeScript"].map(lang => {
                      return <SelectItem key={lang} value={lang} className='font-semibold'>
                          {lang}
                      </SelectItem>
                    })}
                    </SelectContent>
                </Select>
              <ThemeSelector />
              <RunButton />
               <div className='w-[2px] h-12 bg-gray-700 mx-2'/>
              <UserAccountNav />
          </div>
  </nav>
}