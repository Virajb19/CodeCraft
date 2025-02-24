import { Users } from 'lucide-react';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from './ui/form'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/utils'
import { toast } from 'sonner';
import { Loader } from 'lucide-react'
import { AxiosError } from 'axios';
  
const createRoomSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
  })

const joinRoomSchema = z.object({
    roomId: z.string().cuid({ message: "Invalid Room ID" }),
  })

type createRoomInput = z.infer<typeof createRoomSchema>
type joinRoomInput = z.infer<typeof joinRoomSchema>

export default function CreateRoomButton() {

    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const createForm = useForm<createRoomInput>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: { title: '' }
    })

    const joinForm = useForm<joinRoomInput>({
        resolver: zodResolver(joinRoomSchema),
        defaultValues: { roomId: ''}
    })

    const {mutateAsync: createRoom} = useMutation({
      mutationFn: async (data: createRoomInput) => {
          const { data: { roomId }} = await axios.post('/api/user/create/room', data, { withCredentials: true}) 
          return roomId
      }
    })

    const {mutateAsync: joinRoom} = useMutation({
      mutationFn: async (roomId: string) => {
          const res = await axios.put(`/api/user/join/room/${roomId}`, null, { withCredentials: true}) 
          return res.data
      }
    })


    async function handleCreateRoom(data: createRoomInput) {
        await createRoom(data, {
            onSuccess: (roomId: string) => {
               setIsOpen(false)
               toast.success('Room created successfully')
               navigate(`/room/${roomId}`)
            },
            onError: (err) => {
               console.error(err)
               setIsOpen(false)
               toast.error('Error creating game')
            }
        })
        
    } 

    async function handleJoinRoom(data: joinRoomInput) {
       await joinRoom(data.roomId, {
         onSettled: () => setIsOpen(false),
         onSuccess: () => {
            toast.success('Joined room')
            navigate(`/room/${data.roomId}`)
         },
         onError: (err) => {
            console.error(err)
            if(err instanceof AxiosError) {
               toast.error(err.response?.data.msg || 'Error joining room!')
            }
         }
       })
       queryClient.refetchQueries({ queryKey: ['getRoom']})
    }

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <DialogTrigger>
           <button className='flex items-center gap-2 px-3 py-1.5 opacity-75 hover:opacity-100 duration-200 rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800'>
                <Users className='size-5'/> Create a Room
           </button>
       </DialogTrigger>
       <DialogContent>
          <DialogHeader>
              <DialogTitle className='text-xl uppercase'>Create or join a Room</DialogTitle>
          </DialogHeader>
             <Form {...createForm}>
                <form className='space-y-3' onSubmit={createForm.handleSubmit(handleCreateRoom)}>
                
                     <FormField
                          control={createForm.control}
                          name='title'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <input className={twMerge("input-style bg-[#161622]", createForm.formState.errors.title && 'focus:ring-red-600')} {...field} type="text" placeholder="Enter a title"/>
                              </FormControl>
                              <FormMessage className="text-base"/>
                             </FormItem>
                          )}
                        />
                       
                       <button disabled={createForm.formState.isSubmitting} className='px-3 py-1 flex-center gap-2 w-full rounded-lg bg-blue-600 disabled:cursor-not-allowed disabled:opacity-75' type='submit'>
                        {createForm.formState.isSubmitting ? <>
                           <Loader className='size-5 animate-spin'/> Creating...
                        </> : 'Create'}
                        </button>
                </form>
             </Form>

             <div className='flex items-center gap-2'>
                 <div className='h-[2px] grow bg-gray-600'/>
                  <span className=''>OR</span>
                 <div className='h-[2px] grow bg-gray-600'/>
             </div>

             <Form {...joinForm}>
                <form className='space-y-3' onSubmit={joinForm.handleSubmit(handleJoinRoom)}> 
                           
                <FormField
                          control={joinForm.control}
                          name='roomId'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Paste a roomId</FormLabel>
                              <FormControl>
                                 <input className={twMerge("input-style bg-[#161622]", joinForm.formState.errors.roomId && 'focus:ring-red-600')} {...field} type="text" placeholder="Enter a room id"/>
                              </FormControl>
                              <FormMessage className="text-base"/>
                             </FormItem>
                          )}
                        />

                        <button disabled={joinForm.formState.isSubmitting} className='px-3 py-1 w-full flex-center gap-2 rounded-lg bg-blue-600 text-lg disabled:cursor-not-allowed disabled:opacity-75' type='submit'>
                              {createForm.formState.isSubmitting ? <>
                                 <Loader className='size-5 animate-spin'/> Joining...
                              </> : 'Join'}
                           </button>

                </form>
             </Form>
       </DialogContent>
  </Dialog>
}