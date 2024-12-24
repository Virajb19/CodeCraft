import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

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