import { Router } from 'express'
import { getProfile } from '../controllers/user.ctr'

export const userRouter = Router()

userRouter.get('/profile', getProfile)