import { initSocket } from "@/lib/socket"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { ACTIONS } from '../lib/utils'

export default function RoomPage() {

    const navigate = useNavigate()

    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
       const init = async () => {
           socketRef.current = await initSocket()

           socketRef.current.on("connect_error", (err) => handleErrors(err));
           socketRef.current.on("connect_failed", (err) => handleErrors(err));

            const handleErrors = (err: Error) => {
                console.log("Error", err);
                toast.error("Socket connection failed, Try again later");
                navigate("/");
            }
           socketRef.current.emit('joined')
       } 
       init()

       return () => {
         if(socketRef.current) socketRef.current.disconnect()
       }
    }, [])

  return <div className="w-full min-h-screen flex-center">
              Room  
  </div>
}