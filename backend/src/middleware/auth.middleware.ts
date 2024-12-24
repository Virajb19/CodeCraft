import { Request, Response, NextFunction } from 'express';

import 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      image: string;
    }

    interface Request {
      user?: User;
    }
  }
}


export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {

     if(req.isAuthenticated()) return next()
     res.redirect(process.env.CLIENT_BASE_URL as string)
}