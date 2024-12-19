import { Request, Response } from 'express';
import { SignUpSchema } from '../lib/zod';
import db from '../lib/db'
import bcrypt from 'bcrypt'

export async function signup(req: Request, res: Response) {
    try {
        const parsedData = SignUpSchema.safeParse(req.body)
        if(!parsedData.success) {
            res.status(400).json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors})
            return
        } 
        const { username, email, password} = parsedData.data

        const userExists = await db.user.findFirst({where: {OR: [{email}, {username}]}})
        if(userExists) {
            res.status(401).json({msg: 'User already exists'})
            return
        }
    
        const hashedPassword = await bcrypt.hash(password,10)
        await db.user.create({data: {username,email,password: hashedPassword}})

        res.status(201).json({msg: 'User created successfully'})
        return

    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
        return
    }
}
 export async function signout(req: Request, res: Response) {
     try {
        req.logOut((err) => {
             throw new Error('Failed to log out')
        })
        res.status(200).json({msg: 'logged out successfully'})
     } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
        return
     }
 }