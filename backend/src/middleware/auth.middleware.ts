import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import db from '../lib/db'

import 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      image: string | null;
    }

    interface Request {
      user?: User;
    }
  }
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {

     if(req.isAuthenticated()) return next()
     res.redirect(process.env.CLIENT_BASE_URL as string)

    // try {
    //    const token = req.cookies.token
    //    if(!token) {
    //       res.status(401).json({ message: 'Not authenticated' });
    //       return
    //     }
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number }
    //     const user = await db.user.findUnique({where: {id: decoded.userId}, select: {id: true, email: true, ProfilePicture: true, username: true, isPro: true}})
    //     if (!user) {
    //       res.clearCookie('token');
    //       res.status(401).json({ message: 'Invalid user' })
    //       return
    //     }

    //     const formattedUser = {
    //       id: user.id,
    //       email: user.email,
    //       name: user.username,
    //       image: user.ProfilePicture, 
    //       isPro: user.isPro
    //     };
  
    //     req.user = formattedUser
    //     next()
    // } catch(err) {
    //   res.clearCookie('token');
    //   res.status(401).json({ message: 'Invalid token' })
    //   return
    // }
}