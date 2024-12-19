import passport from 'passport';
import GitHubStrategy from 'passport-github';
import db from './db'

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: 'http://localhost:3000/api/auth/callback/github'
},
 async (accessToken, refreshToken, profile, done) => {

       const provider = profile.provider === 'github' ? 'GITHUB' : 'GOOGLE'
       console.log(profile)

     try {
        const user = await db.user.findFirst({where: {OauthId: profile.id}})
        if(user) await db.user.update({where: {id: user.id}, data: {lastLogin: new Date()}})
        else {
         const user = await db.user.create({data: {username: profile.username ?? '', email: (profile.emails && profile.emails[0]?.value) ?? '',lastLogin: new Date(), ProfilePicture: profile.profileUrl, OauthProvider: provider, OauthId: profile.id}})
         return done(null, { id: user.id, email: user.email, name: user.username, image: user.ProfilePicture})
        }
        return done(user)
     } catch(err) {
         console.error(err)
     }
 }
))

passport.serializeUser((user: any, done) => {
    done(null,{ id: user.id, name: user.name, email: user.email, image: user.image})
})