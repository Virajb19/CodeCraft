import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Room } from '../lib/utils'
import axios from '../lib/utils'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from 'framer-motion'
import InviteUserButton from "@/components/InviteUserButton";
import { useAuth } from "@/lib/useAuth";
import { Loader2 } from 'lucide-react'
import CollaborativeCodeEditor from "@/components/CollaborativeCodeEditor";
import { useSocket } from "@/hooks/useSocket";

const colors = ['red', 'blue', 'green', 'orange', 'purple'];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

export default function RoomPage() {
  
    const navigate = useNavigate()
    const { id } = useParams()

     const socket = useSocket(id ?? '')

     const { user } = useAuth()

    // const [count,setCount] = useState(0)

    const {data: room, isLoading} = useQuery<Room>({ 
      queryKey: ['getRoom', id],
      queryFn: async () => {
         try {
            const { data: { room }} = await axios.get(`/api/user/get/room/${id}`, { withCredentials: true})
            return room
         } catch(err) {
           console.error(err)
           if(err instanceof AxiosError) {
             toast.error(err.response?.data.msg || 'Something went wrong!!')
             if(err.response?.status === 404) navigate('/editor')
           }
          throw new Error('Error fetching room')
         }
      }
    })

    useEffect(() => {
       if(!isLoading && !room) {
          navigate('/editor')
       }
    }, [isLoading, room, navigate])

    // In useMemo
    // const colors = ['red', 'blue', 'green', 'orange', 'purple']; 
    // const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // const { owner, participants} = useMemo(() => {
    //     return { owner: room?.owner, participants: room?.participants}
    // }, [room])

    const owner = room?.owner
    const participants = room?.participants

    // if(isLoading) return <p>Loading...</p>

    // useEffect(() => {
    //   if(!room || !user) return
 
    //   const isParticipant = room.participants.some(p => p.id === user.id)
    //   const isOwner = room.ownerId === user.id

    //   if(!isParticipant && !isOwner) {
    //     toast.error('Join the room first!!!', { position: 'top-center'})
    //     navigate('/editor')
    //     return
    //   }

    // }, [room, user])

    const listRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
          if(listRef.current) {
             listRef.current.scrollTo({
               top: listRef.current.scrollHeight,
               behavior: 'smooth'
             })
          }
    }, [participants])

    const queryClient = useQueryClient()

    const {mutateAsync: leaveRoom, isPending} = useMutation({
      mutationFn: async (id: string) => {
          const res = await axios.put(`/api/user/leave/room/${id}`, null, { withCredentials: true})
          // await new Promise(r => setTimeout(r, 7000))
          return res.data
      },
      onSuccess: () => {
          toast.success('Left the room', { position: 'top-center'})
          navigate('/editor')
      },
      onError: (err) => {
        console.error(err)
        toast.error('Something went wrong!!!')
      }
    })
 
  return <div className="w-full min-h-screen flex relative overflow-hidden">
              {/* <pre>{JSON.stringify(room)}</pre> */}
         <motion.div id="sidebar" className="flex flex-col gap-1 p-2 w-1/5 border" initial={{x: '-100%'}} animate={{x: 0}} transition={{duration: 0.7, type: 'spring', damping: 15, stiffness: 200}}>
               <div id="header" className="flex items-center gap-3 border-b-2 border-gray-600 py-2">
                  <img src={'/code.png'} className="size-12"/>
                  <h2 className="text-4xl font-bold uppercase bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text">CodeCraft</h2>
               </div>

               {/* <button onClick={() => setCount(count + 1)} className="absolute top-1/2 lef1/2 bg-red-700 p-2">CLick</button> */}

               <ul ref={listRef} className="border-b-2 border-zinc-600 flex flex-col gap-2 p-1 mt-3 h-[calc(90vh-7rem)] overflow-y-scroll">
                   <li className="flex items-center gap-7 py-2 px-3 rounded-xl border border-zinc-600">
                         {owner?.ProfilePicture ? (
                            <img src={owner.ProfilePicture} className="size-16 rounded-full"/>
                         ) : (
                           <span style={{backgroundColor: randomColor}}
                            className="size-16 flex-center text-3xl rounded-full">{owner?.username.split(' ').slice(0,2).map(name => name[0]).join('')}</span>
                         )}
                         <strong className="text-2xl capitalize truncate">{owner?.username}</strong>
                   </li>
                    {participants?.map((participant,i) => {
                          return <motion.li initial={{y: -10, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.3, ease: 'easeOut', delay: i * 0.1}}
                                  key={participant.id} className="flex items-center gap-7 py-2 px-3 rounded-xl border border-zinc-600">
                                  {participant?.ProfilePicture ? (
                                    <img src={participant.ProfilePicture ?? ''} referrerPolicy="no-referrer" className="size-16 rounded-full"/>
                                   ) : (
                                  <span style={{backgroundColor: randomColor}}
                                    className="size-16 flex-center text-3xl rounded-full">{participant?.username.split(' ').slice(0,2).map(name => name[0]).join('')}</span>
                                )}
                                <strong className="text-2xl capitalize truncate">{participant?.username}</strong>
                          </motion.li>
                    })}

                    {/* <div className="bg-red-700 h-[100vh] shrink-0" /> */}
               </ul>

              {/* {room?.ownerId === user?.id && <InviteUserButton roomId={room?.id ?? ''}/>} */}
              <InviteUserButton roomId={room?.id ?? ''}/>
              <button onClick={async () => {
                await leaveRoom(room?.id ?? '')
                // queryClient.refetchQueries({ queryKey: ['getRoom']}) This will run only for the client where button is clicked 
              }} disabled={isPending} className="bg-red-700 hover:bg-red-600 duration-300 flex-center gap-3 mt-2 font-semibold py-1 rounded-xl text-lg disabled:cursor-not-allowed disabled:opacity-70">
                   {isPending ? <>
                      <Loader2 className="size-5 animate-spin"/> Leaving...
                   </> : 'Leave the room'}
              </button>
         </motion.div>

      <CollaborativeCodeEditor socket={socket} roomId={room?.id ?? ''}/>
  </div>
}