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

export async function getRoom(req: Request, res: Response) {
     try {

         const userId = req.user?.id
         if(!userId) {
            res.status(401).json({msg: 'Not authorized'})
            return
        } 
   
        const { id } = req.params
   
        const room = await db.room.findUnique({where: {id}, include: {owner: {select: {username: true, ProfilePicture: true}}, participants: {select: {id: true,username: true, ProfilePicture: true}}}})
        if(!room) {
          res.status(404).json({msg: 'Room not found!'})
          return
        }
        
        res.status(200).json({room})
     } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Internal server error'})
     }
}

export async function leaveRoom(req: Request, res: Response) {
    try {
      const userId = req.user?.id
         if(!userId) {
            res.status(401).json({msg: 'Not authorized'})
            return
       } 

       const { id } = req.params

       const room = await db.room.findUnique({ where: { id}, include: { participants: { select: { id: true}}}})
       if(!room) {
          res.status(404).json({msg: 'room not found'})
          return
       }

       if(room.ownerId === userId) {
           await db.room.delete({ where: { id: room.id}})
           res.status(203).json({msg: 'Deleted room successfully'})
           return
         // await db.room.update({ where: { id }, data: { ownerId: room.participants[0].id}})
       }

       await db.room.update({where: {id}, data: { participants: { disconnect: { id: userId}}}})
       res.status(200).json({msg: 'Left the room'})
    } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Internal server error'})
    }
}