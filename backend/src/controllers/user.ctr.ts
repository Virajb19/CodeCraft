import { Request, Response } from 'express';

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