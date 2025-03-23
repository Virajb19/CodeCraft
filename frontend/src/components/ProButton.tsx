import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Sparkles } from 'lucide-react'
import { useMutation } from "@tanstack/react-query"
import axios from '../lib/utils'
import { toast } from "sonner"

export default function ProButton() {

    const {mutateAsync: createCheckOutSession, isPending} = useMutation({
        mutationFn: async () => {
           const res = await axios.post('/api/stripe/create-checkout-session', null, { withCredentials: true})
           return res.data.sessionUrl
        },
        onSuccess: (url: string) => {
        //    toast.success(url)
           window.location.href = url
        },
        onError: (err) => {
            console.error(err)
            // toast.error('Something went wrong!!!')
        }
    })

  return <TooltipProvider>
     <Tooltip>
         <TooltipTrigger asChild>
            <button disabled={isPending} onClick={() => 
                 toast.promise(createCheckOutSession(), { loading: 'Directing to stripe page...', success: 'Directed', error: 'Error', position: 'top-center'})
            } className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
            to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70">
                    <Sparkles className="text-amber-400 hover:text-amber-300 fill-amber-400"/> 
                    <span className="text-amber-400/90 hover:text-amber-600 font-semibold">Pro</span>
                </button>
         </TooltipTrigger>
         <TooltipContent sideOffset={12} className="border-[3px] border-blue-600">
             <p className="text-lg px-2">Unlock all languages</p>
         </TooltipContent>
     </Tooltip>
  </TooltipProvider>

}