import { Request, Response } from 'express';
import db from '../lib/db'
import { createCommentSchema, createRoomSchema, SignInSchema, SignUpSchema } from '../lib/zod';
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

 export async function getProfile(req: Request, res: Response) {
     try {
      console.log(req.user)
         // if(!req.user) {
         //    res.json({user: null})
         //    return
         // }  

         const userId = req.user?.id
         if(!userId) {
             res.json({user: null})
             return
         }

         const user = await db.user.findUnique({where: {id: userId}, select: {id: true, email: true, username: true ,ProfilePicture: true, isPro: true}})
         if(!user) {
          res.json({ user: null });
          return
         }
  
         const formattedUser = {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.ProfilePicture, 
          isPro: user.isPro
         }
  
         res.json({user: formattedUser})
     
     } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
     }
 }

export async function signup(req: Request, res: Response) {
   try {
        const parsedData = SignUpSchema.safeParse(req.body)
        if(!parsedData.success) {
         res.status(400).json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors})
         return
        }

     const { email, password, username } = parsedData.data  

     const userExists = await db.user.findUnique({where: {email}})
     if(userExists) {
       res.status(400).json({msg: 'user already exists'})
       return
     }

    const hashedPassword = await bcrypt.hash(password,10)
    await db.user.create({data: {username,email,password: hashedPassword}, select: {id: true, email: true}})

    res.status(201).json({msg: 'User created'})

   } catch(err) {
      console.error('Error creating account', err)
      res.status(500).json({msg: 'Error creating account'})
   }
}


export async function signin(req: Request, res: Response) {
   try {
      const parsedData = SignInSchema.safeParse(req.body)
      if(!parsedData.success) {
       res.status(400).json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors})
       return
      }
      const {email,password} = parsedData.data

      const user = await db.user.findUnique({where: {email}})
      if(!user) {
         res.status(404).json({msg: 'User not found!.Check your email'})
         return
      }

      const isMatch = await bcrypt.compare(password, user.password as string)     
      if(!isMatch) {
         res.status(403).json({msg: 'Incorrect password. Try again !!!'})
         return
      }

      await db.user.update({where: {id: user.id}, data: {lastLogin: new Date()}})

      const token = jwt.sign({ userId: user.id }, process.env.SESSION_SECRET || 'secret', { expiresIn: '7d' })
      console.log(token)
      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'none',
         maxAge: 25 * 60 * 60 * 24 * 1000
      })

      res.json({ message: 'Logged in successfully' })
   } catch(err) {
      console.error('Error signing in', err)
      res.status(500).json({msg: 'Error logging in'})
   }
}

export async function logout(req: Request, res: Response) {
  try {
   res.clearCookie('token');
   res.json({ message: 'Logged out successfully' })
  } catch(err) {
   console.error('Error signing out', err)
   res.status(500).json({msg: 'Error logging out'})
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

     if(room.ownerId === userId) {
      res.status(403).json({msg: 'You are the owner of this room'})
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
   
        const room = await db.room.findUnique({where: {id}, include: {owner: {select: {id: true, username: true, ProfilePicture: true}}, participants: {select: {id: true,username: true, ProfilePicture: true}}}})
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
           await db.room.update({ where: { id: room.id}, data: { deletedAt: new Date()}})
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

export async function createComment(req: Request, res: Response) {
     try {
         const userId = req.user?.id
         if(!userId) {
            res.status(401).json({msg: 'Not authorized'})
            return
         } 

         const parsedData = createCommentSchema.safeParse(req.body)
         if(!parsedData.success) {
             res.status(400).json({msg: 'Invalid input', errors: parsedData.error.flatten().fieldErrors})
             return
         }

         const { content } = parsedData.data

         const { id } = req.params
         const snippet = await db.snippet.findUnique({where: {id}, select: { userId: true}})
         if(!snippet) {
            res.status(404).json({msg: 'snippet not found'})
            return
         }

         if(snippet.userId === userId) {
            res.status(403).json({msg: 'You cannot post a comment on your own snippet!'})
            return
         }

         const comment = await db.comment.create({data: {content,userId,snippetId: id}})

         res.status(201).json({msg: 'Comment posted!!', commentId: comment.id})
         
     } catch(err) {
         console.error(err)
         res.status(500).json({msg: 'Internal server error'})
     }
}

export async function deleteComment(req: Request, res: Response) {
   try {
      const userId = req.user?.id
      if(!userId) {
         res.status(401).json({msg: 'Not authorized'})
         return
      } 

      const { id } = req.params
      const comment = await db.comment.findUnique({ where: { id }, select: { userId: true}})
      if(!comment) {
         res.status(404).json({msg: 'comment not found!!'})
         return
      }

      if(comment.userId !== userId) {
         res.status(403).json({msg: 'You are not authorized to delete this comment'})
         return
      }

      await db.comment.delete({where: { id }})

      res.status(204).json({msg: 'comment deleted!'})

   } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Internal server error'})
   }
}

export async function editComment(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if(!userId) {
         res.status(401).json({msg: 'Not authorized'})
         return
      } 

      const { id } = req.params
      const comment = await db.comment.findUnique({ where: { id }, select: { id: true, userId: true}})
      if(!comment) {
         res.status(404).json({msg: 'comment not found!!'})
         return
      }

      if(comment.userId !== userId) {
         res.status(403).json({msg: 'You are not authorized to edit this comment'})
         return
      }

      const parsedData = z.object({ newContent: z.string()}).safeParse(req.body)
      if(!parsedData.success) {
         res.status(400).json({msg: 'Invalid input', errors: parsedData.error.flatten().fieldErrors})
         return
      }
      const { newContent } = parsedData.data

      await db.comment.update({ where: { id: comment.id}, data: { content: newContent}})

      res.status(200).json({msg: 'comment edited successfully'})

    } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Error editing comment'})
    }
}