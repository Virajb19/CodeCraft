import { Request, Response, NextFunction } from 'express';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {

     if(req.path === '/signup') return next()
     if(req.isAuthenticated()) return next()
     res.status(401).json({msg: 'Unauthorized. Please log in!!!'})
}