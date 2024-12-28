import { Request, Response } from 'express';
import db from '../lib/db'
import { createRoomSchema } from '../lib/zod';

 export async function getProfile(req: Request, res: Response) {
    console.log('profile')
     try {
        res.status(200).json({ user: req.user || 'user'})
        return
        if(req.isAuthenticated()) {
            res.status(200).json({user: req.user})
        }
     } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
     }
 }

export async function createRoom(req: Request, res: Response) {
   try {
      const userId = req.user?.id
      if(!userId) {
         res.status(401).json({msg: 'Not authorized'})
         return
     } 

     const parsedData = createRoomSchema.safeParse(req.body)
     if(!parsedData.success) {
         res.status(400).json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors})
         return
     }

     const { title } = parsedData.data

     const room = await db.room.create({data: {title,ownerId: userId}})

     res.status(200).json({roomId: room.id})

   } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Internal server error'})
   }
}

export async function joinRoom(req: Request, res: Response) {
   try {
      const userId = req.user?.id
      if(!userId) {
         res.status(401).json({msg: 'Not authorized'})
         return
     } 

     const { id } = req.params

     const room = await db.room.findUnique({where: {id}})
     if(!room) {
       res.status(404).json({msg: 'Room not found!'})
       return
     }
     
      await db.room.update({where: {id}, data: { participants: {connect: { id: userId}}}})

      res.status(200).json({msg: 'Joined room successfully'})
   } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Internal server error'})
   }
}