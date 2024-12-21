import { useCopyToClipboard} from 'usehooks-ts'
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from "lucide-react";
import { useCodeEditorStore } from '@/lib/store';
import { useState } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { Skeleton } from './ui/skeleton';


export default function OutputPanel() {

const { error,output, isRunning} = useCodeEditorStore()

const [copiedText, copy] = useCopyToClipboard()
const [isCopied, setIsCopied] = useState(false)

const hasContent = error || output

const handleCopy = async () => {
   if(!hasContent) return
   const res = await copy(hasContent)
   setIsCopied(res)
   if(res) toast.success('Copied !')
   else toast.error('Failed to copy!!')
   setTimeout(() => setIsCopied(false), 2000)               
}

  return <div className="bg-[#181825] grow rounded-xl p-4 ring-1 ring-gray-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
                  <Terminal className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-300">Output</span>
              </div>
              {hasContent && (
                 <button onClick={handleCopy} 
                   className={twMerge('border flex items-center gap-2 px-2.5 py-1.5 text-gray-400 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800/50 transition-all duration-200', 
                    isCopied ? "text-green-500 ring-green-700/30" : "hover:text-gray-300 hover:ring-gray-700/50")}>
                    {isCopied ? (
                      <>
                         <CheckCircle className="size-5" />
                         Copied!
                    </>
                     ) : (
                      <>
                           <Copy className="size-5" />
                           Copy
                      </>
                    )}
                 </button>
             )}
        </div>

        <div className='h-[calc(90vh-9rem)] w-[42vw] overflow-scroll bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] text-sm rounded-xl p-2'>
             {/* <div className='w-[100vw] h-[100vh] border overflow-hidden'>hello</div> */}
             {isRunning ? (
                <div className='flex flex-col gap-5 border'>
                  {Array.from({length: 7}).map((_,i) => {
                     return <div key={i} className='flex flex-col gap-2'>
                        {Array.from({length: 3}).map((_,i) => {
                            const width = `${Math.random() * 40 + 40}%`
                            return <Skeleton key={i} style={{ height: '15px', width}}/>
                        })}
                  </div>
                  })}
                </div>
             ) : (
                error ? (
                   <div className='flex flex-col gap-3'>
                      <div className='flex items-center gap-3 text-red-400'>
                         <AlertTriangle className='size-6'/>
                         <span className='font-semibold text-md'>Execution Error!</span>
                      </div>
                      <pre className='whitespace-pre-wrap text-red-400/80'>{error}</pre>
                   </div>
                ) : (
                   output ? (
                     <div className='flex flex-col gap-2'>
                         <div className='flex items-center gap-3 text-emerald-400 mb-3'>
                           <CheckCircle className="w-5 h-5" />
                           <span className='font-semibold'>Execution Successful</span>
                         </div>
                         <pre className='whitespace-pre-wrap text-gray-400'>{output}</pre>
                     </div>
                   ) : (
                     <div className='h-full flex-center flex-col gap-5'>
                           <span className='p-3 flex-center rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50'>
                             <Clock className="size-6" />
                           </span>
                           <p className='text-center text-lg'>Run your code to see the output here...</p>
                     </div>
                   )
                )
             )}
        </div>
  </div>
}