import { Router, Request, Response } from "express";
import passport from "passport";

export const authRouter = Router()

authRouter.get('/github', passport.authenticate('github'))

authRouter.get('/callback/github', passport.authenticate('github', { failureRedirect: '/'}, (req: Request, res: Response) => res.redirect('/')))

authRouter.get('/check',(req: Request, res: Response) => {
    if (req.isAuthenticated()) {
		res.send({ user: req.user });
	} else {
		res.send({ user: null });
	}
})

authRouter.get('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
		res.json({ message: "Logged out" })
	})
})