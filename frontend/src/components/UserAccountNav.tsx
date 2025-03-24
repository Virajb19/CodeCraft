import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/useAuth";
import axios from '../lib/utils';
import { Code, LogOut, User, User2 } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UserAccountNav() {

 const { user, isLoading } = useAuth()
 const navigate = useNavigate()

 const queryClient = useQueryClient()

 const logout = useMutation({
    mutationFn: async () => {
        const res = await axios.delete('/api/auth/logout', { withCredentials: true})
        return res.data
    },
    onSuccess: () => {
        toast.success('Logged out')
        navigate('/')
    },
    onError: (err) => {
       console.error(err)
    },
    onSettled: () => queryClient.refetchQueries({queryKey: ['getUser']})
 })

  return <main>
             <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                        <Avatar>
                            {(!isLoading && user?.image) ? (
                             <img src={user?.image ?? undefined} alt="user" referrerPolicy="no-referrer" className="rounded-full object-cover size-11"/>
                            ): (
                                <div className="p-3 rounded-full bg-gradient-to-b from-blue-400 to-blue-700"><User className=""/></div>
                            )}
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='m-2 min-w-44 z-[99999] rounded-md bg-neutral-100 dark:bg-neutral-900 border-[3px] border-blue-600' align='center'> 
                     <DropdownMenuItem>
                        <div className='flex flex-col'>
                            {user?.name && <p className='text-lg truncate'>{user.name}</p>}
                            {user?.email && <p className='text-sm text-zinc-500 truncate'>{user.email}</p>}
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="p-0">
                        <Link to={'/profile'} className="flex items-center gap-2 text-base w-full p-1.5 hover:text-blue-600 duration-200"><User2 className="size-4" strokeWidth={3}/> Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="p-0">
                        <Link to={'/editor'} className="flex items-center gap-2 p-1.5 w-full text-base hover:text-blue-600 duration-200">
                            <Code className="size-4"/> Editor
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem disabled={logout.isPending} className='outline-none cursor-pointer p-0' onClick={() => {
                        logout.mutate()
                    }}>
                       <span className='flex items-center gap-2 text-base p-1.5 w-full transition-all duration-300 hover:text-red-500'><LogOut className='size-4'/> Log out</span>
                       </DropdownMenuItem>
                       
                    </DropdownMenuContent>
                </DropdownMenu>
  </main>
}