import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import db from './db'
import passport from 'passport'

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
