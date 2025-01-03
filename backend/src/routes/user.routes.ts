import { Router } from 'express'
import { createComment, createRoom, deleteComment, getProfile, getRoom, joinRoom, leaveRoom } from '../controllers/user.ctr'

export const userRouter = Router()

userRouter.get('/profile', getProfile)
userRouter.post('/create/room', createRoom)
userRouter.put('/join/room/:id', joinRoom)
userRouter.get('/get/room/:id', getRoom)
userRouter.put('/leave/room/:id', leaveRoom)
userRouter.post('/post/comment/:id', createComment)
userRouter.delete('/delete/comment/:id', deleteComment)