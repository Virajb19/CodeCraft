import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware";
import db from '../lib/db'

export const authRouter = Router()

authRouter.get('/github', passport.authenticate('github', {scope: ["user:email"]}))

authRouter.get('/callback/github', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('github', { failureRedirect: process.env.CLIENT_BASE_URL }, (err: Error, user: Express.User, info: any) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            return res.redirect(process.env.CLIENT_BASE_URL as string); // Redirect on failure
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            return res.redirect(process.env.CLIENT_BASE_URL as string + '/editor'); // Redirect on success
        });
    })(req, res, next);
});

authRouter.get('/google', passport.authenticate('google', {scope: ['email','profile']}))

authRouter.get('/google/callback', passport.authenticate('google', {
    successRedirect: process.env.CLIENT_BASE_URL as string,
    failureRedirect: process.env.CLIENT_BASE_URL as string
}))

authRouter.get('/check', async (req: Request, res: Response) => {
    if(!req.isAuthenticated()) {
        res.json({user: null})
        return
    }
    // console.log(req.isAuthenticated())

    const userId = req.user.id

    if(!userId) {
        res.json({user: null})
        return
    }

    try {
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
    };

       res.json({user: formattedUser})
    } catch(err) {
       console.error('Error fetching user',err)
       res.status(500).json({ error: "Failed to fetch user data" })
    }
})

authRouter.delete('/logout', isAuthenticated ,(req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Failed to log out" });
        }
		res.status(200).json({ message: "Logged out" })
	})
})