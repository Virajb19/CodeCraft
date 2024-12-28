import { Router } from 'express'
import { createRoom, getProfile, joinRoom } from '../controllers/user.ctr'

export const userRouter = Router()

userRouter.get('/profile', getProfile)
userRouter.post('/create/room', createRoom)
userRouter.put('/join/room/:id', joinRoom)