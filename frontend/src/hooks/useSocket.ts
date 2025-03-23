import { useSocketStore } from '@/lib/store'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

export const useSocket = (roomId: string) => {
    const { socket, connectSocket } = useSocketStore()

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    useEffect(() => {

        if(!socket) {
            connectSocket(roomId)
            return
        }

        if(!socket) return
        const handleErrors = (err: Error) => {
            console.log("Error", err)
            toast.error("Socket connection failed, Try again later");
            navigate("/editor");
        }

        socket.on('connect', () => console.log('connected'))
        socket.on("disconnect", () => console.log("Socket disconnected"))
        socket.on("connect_error", (err) => handleErrors(err));
        socket.on("connect_failed", (err) => handleErrors(err));

    
        const joinRoom = () => {

        }

        const leaveRoom = () => {

        }

        const deleteRoom = () => {
            
        }

        const codeChange = (code: string) => {

        }
        socket.off('join:room').on('join:room', joinRoom)
        socket.off('leave:room').on('leave:room', leaveRoom)
        socket.off('delete:room').on('delete:room', deleteRoom)
        socket.off('code:change').on('code:change', codeChange)

        return () => {
            if(socket) {
                socket.off('join:room', joinRoom)
                socket.off('leave:room', leaveRoom)
                socket.off('delete:room', deleteRoom)
                socket.off('code:change', codeChange)
            }
        }
    }, [roomId,socket])

    return socket
}