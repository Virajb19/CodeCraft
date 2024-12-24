import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { userRouter } from './routes/user.routes';
import session from 'express-session';
import passport from 'passport'
import { isAuthenticated } from './middleware/auth.middleware';
import { authRouter } from './routes/auth.routes';
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import db from './lib/db'
import { executionRouter } from './routes/code-execution.routes';
import { snippetRouter } from './routes/snippet.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))
app.use(express.json())

passport.serializeUser(function (user: any, done) {
	done(null, user);
});

passport.deserializeUser(function (obj: any, done) {
	done(null, obj);
});


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: 'http://localhost:3000/api/auth/callback/github'
},
async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any | false) => void) => {

     const provider = profile.provider === 'github' ? 'GITHUB' : 'GOOGLE'

   try {
      const user = await db.user.findFirst({where: {OauthId: profile.id}})
      if(user) {
        await db.user.update({where: {id: user.id}, data: {lastLogin: new Date()}})
        return done(null, {id: user.id, email: user.email, name: user.username, image: user.ProfilePicture})
      }
      else {
       const user = await db.user.create({data: {username: profile.username ?? '', email: profile.emails?.[0]?.value || '',lastLogin: new Date(), ProfilePicture: profile.photos?.[0]?.value || null, OauthProvider: provider, OauthId: profile.id}})
       return done(null, { id: user.id, email: user.email, name: user.username, image: user.ProfilePicture})
      }
   } catch(err) {
       console.error(err)
       return done(err)
   }
}
))

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth/', authRouter)
app.use('/api/user/', userRouter)
app.use('/api/codeExecution', isAuthenticated, executionRouter)
app.use('/api/snippet', isAuthenticated, snippetRouter)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  