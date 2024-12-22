import { Router } from 'express'
import { getProfile, signout, signup } from '../controllers/user.ctr'

export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/signout', signout)
userRouter.get('/profile', getProfile)