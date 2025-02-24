import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { userRouter } from './routes/user.routes';
import session from 'express-session';
import passport from 'passport'
import { isAuthenticated } from './middleware/auth.middleware';
import { authRouter } from './routes/auth.routes';
import { executionRouter } from './routes/code-execution.routes';
import { snippetRouter } from './routes/snippet.routes';
import http from 'http'
import { Server } from 'socket.io'

dotenv.config();

import './lib/passport.config'
import { stripeRouter } from './routes/stripe.routes';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
}) 

declare module 'socket.io' {
  interface Socket {
    username?: string;
    userId?: number
  }
}

let userSocketMap: Record<string, { userId: number, username: string}> = {}

const getUsersInRoom = (roomId: string) => {
  let participants = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => ({socketId, userId: userSocketMap[socketId].userId, username: userSocketMap[socketId].username}))
  const set = new Set()
  participants = participants.filter(p => {
     if(set.has(p.userId)) return false
     set.add(p.userId)
     return true
  })
  return participants
}

io.on('connection', socket => {
    console.log(`user connected ${socket.id}`)

    socket.on('join', ({roomId, username, userId}) => {
        userSocketMap[socket.id] = { userId, username}
        socket.join(roomId)

        let participants = getUsersInRoom(roomId)

        console.log(participants)
          
        socket.to(roomId).emit('joined', {
          participants,
          username,
          userId,
          socketId: socket.id
        })
    })

    socket.on('code-change', ({roomId, code}) => {
       console.log(code)
       socket.in(roomId).emit('code-change', { code })
    })

    socket.on('sync-code', ({socketId, code}) => {
      io.to(socketId).emit('sync-code', { code })
    })

    socket.on('disconnecting', () => {
      const rooms = [...socket.rooms]
      rooms.forEach(roomId => {
         socket.in(roomId).emit('disconnected', {
            socketId: socket.id, 
            username: userSocketMap[socket.id].username,
            userId: userSocketMap[socket.id].userId
         })
         socket.leave(roomId)
      })
      delete userSocketMap[socket.id]
    })

})

app.use(cors({
  origin: process.env.CLIENT_BASE_URL ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))
app.use(express.json({ limit: '100mb'}))

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret', 
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth/', authRouter)
app.use('/api/user/', userRouter)
app.use('/api/codeExecution', isAuthenticated, executionRouter)
app.use('/api/snippet', isAuthenticated, snippetRouter)
app.use('/api/stripe', isAuthenticated, stripeRouter)

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  