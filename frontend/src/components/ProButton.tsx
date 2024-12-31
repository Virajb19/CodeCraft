import { Link } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Sparkles } from 'lucide-react'
import { CHECKOUT_URL } from "@/lib/utils"

export default function ProButton() {
  return <TooltipProvider>
     <Tooltip>
         <TooltipTrigger asChild>
            <Link target="_blank" rel="noopener noreferrer" to={CHECKOUT_URL} className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
            to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300">
                    <Sparkles className="text-amber-400 hover:text-amber-300 fill-amber-400"/> 
                    <span className="text-amber-400/90 hover:text-amber-600 font-semibold">Pro</span>
                </Link>
         </TooltipTrigger>
         <TooltipContent sideOffset={12}>
             <p className="text-lg px-2">Unlock all languages</p>
         </TooltipContent>
     </Tooltip>
  </TooltipProvider>
}