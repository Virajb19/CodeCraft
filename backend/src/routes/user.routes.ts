import { Router } from 'express'
import { createComment, createRoom, deleteComment, editComment, getProfile, getRoom, joinRoom, leaveRoom, logout, signin, signup } from '../controllers/user.ctr'
import { isAuthenticated } from '../middleware/auth.middleware'

export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/signin', signin)
userRouter.delete('/signout', isAuthenticated,logout)
userRouter.get('/profile', getProfile)
userRouter.post('/create/room', createRoom)
userRouter.put('/join/room/:id', joinRoom)
userRouter.get('/get/room/:id', getRoom)
userRouter.put('/leave/room/:id', leaveRoom)
userRouter.post('/post/comment/:id', createComment)
userRouter.delete('/delete/comment/:id', deleteComment)
userRouter.put('/edit/comment/:id', editComment)