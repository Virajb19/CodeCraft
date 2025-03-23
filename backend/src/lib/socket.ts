import { Server, Socket } from "socket.io";

interface CustomSocket extends Socket {
    room?: string
 } 

export function setUpSocketServer(io: Server) {
    io.use((socket: CustomSocket, next) => {
        const { roomId } = socket.handshake.auth
        if(!roomId) {
           return next(new Error('Invalid room'))
        }
        const rooms = Array.from(socket.rooms)
        rooms.forEach(room => {
           if(room !== socket.id) {
              socket.leave(room)
           }
        })
        socket.join(roomId)
        socket.room = roomId
        next()
     })

     io.on('connection', (socket) => {
        console.log('User connected:', socket.id)
        const roomId = socket.handshake.auth.roomId as string

        socket.on('code:change', (code: string) => {
           socket.to(roomId).emit('code:change', code)
        })

        socket.on('join:room', (participant: any) => {
            socket.to(roomId).emit('join:room', participant)
        })

        socket.on('leave:room', (participant: any) => {
           socket.to(roomId).emit('leave:room', participant)
        })

        socket.on('delete:room', () => {
          socket.to(roomId).emit('delete:room')
        })
     })
  
}