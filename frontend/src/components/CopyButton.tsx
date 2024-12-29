import { useCopyToClipboard} from 'usehooks-ts'
import { CheckCircle, Copy } from "lucide-react";
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export default function CopyButton({code}: {code: string}) {

    const [copiedText, copy] = useCopyToClipboard()
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        if(!code) return
        const res = await copy(code)
        setIsCopied(res)
        if(res) toast.success('Copied !')
        else toast.error('Failed to copy!!')
        setTimeout(() => setIsCopied(false), 2000)               
     }
     

  return <button onClick={handleCopy} 
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
             
  
}