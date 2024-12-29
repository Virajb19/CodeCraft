import { useState } from "react";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckCircle, Copy } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function InviteUserButton({roomId}: {roomId: string}) {

    const [open, setOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const [copiedText, copy] = useCopyToClipboard()

  return <Dialog open={open} onOpenChange={val => setOpen(val)}>
      <DialogTrigger>
            <button className="bg-green-600 w-full font-semibold py-1 rounded-xl text-lg">
                    Invite a user
        </button>
      </DialogTrigger>
      <DialogContent>
      <DialogHeader>
              <DialogTitle className="text-2xl">Invite a user</DialogTitle>
          </DialogHeader>
               <div className="flex items-center gap-5">
                   <div className="bg-[#1e1e22] px-4 py-2 text-lg rounded-md">
                        {roomId}
                   </div>
                     <button onClick={async () => {
                         await copy(roomId)
                         setIsCopied(true)
                         setTimeout(() => setIsCopied(false), 2000)
                     }} className={twMerge("border p-2 rounded-md", isCopied && "text-green-500")}>
                        {isCopied ? <CheckCircle /> : <Copy />}
                     </button>
               </div>
               <p className="text-gray-500">Copy the room ID to share with other users</p>
      </DialogContent>
  </Dialog>
}