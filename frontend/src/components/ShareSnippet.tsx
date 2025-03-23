import { useState } from "react";
import { useCopyToClipboard } from 'usehooks-ts'
import { Copy, CheckCheck} from 'lucide-react'
import { twMerge } from "tailwind-merge";

export default function ShareSnippet() {

  const [isCopied, setIsCopied] = useState(false)
  const [copiedText, copy] = useCopyToClipboard()

  return <button disabled={isCopied} onClick={() => {
    copy(window.location.href)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2500)
  }} className={twMerge("rounded-xl font-semibold w-fit px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity disabled:cursor-not-allowed", 
    isCopied && 'text-green-500'
  )}>
       {isCopied ? <CheckCheck /> : <Copy />} 
             Copy URL and share
  </button>
}