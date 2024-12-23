import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/useAuth";
import { Avatar } from "@radix-ui/react-avatar";
import axios from '../lib/utils';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function UserAccountNav() {

 const { user } = useAuth()
 const navigate = useNavigate()

  return <main>
             <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                        <Avatar>
                            {user?.image ? (
                             <img src={user?.image} alt="user" className="rounded-full object-cover size-11"/>
                            ): (
                                <div className="p-3 rounded-full bg-gradient-to-b from-blue-400 to-blue-700"><User className=""/></div>
                            )}
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='m-2 min-w-44 z-[99999] rounded-md bg-neutral-100 dark:bg-neutral-900' align='center'> 
                     <DropdownMenuItem>
                        <div className='flex flex-col'>
                            {user?.name && <p className='text-lg'>{user.name}</p>}
                            {user?.email && <p className='text-sm text-zinc-500 truncate'>{user.email}</p>}
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className='outline-none cursor-pointer' onClick={async () => {
                         await axios.get('/api/auth/logout', { withCredentials: true})
                         navigate('/')
                    }}>
                       <span className='flex items-center gap-2 text-base transition-all duration-300 hover:text-red-500'>Log out <LogOut className='size-4'/></span>
                       </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
  </main>
}