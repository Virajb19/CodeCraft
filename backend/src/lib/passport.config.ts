import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import db from './db'
import passport from 'passport'
import dotenv from 'dotenv'
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { OauthProvider } from '@prisma/client'
import 'express'

declare global {
   namespace Express {
     interface User {
        isPro: boolean
     }
   }
}

dotenv.config()

passport.serializeUser(function (user: any, done) {
	done(null, user); 
});

passport.deserializeUser(function (obj: any, done) {
	done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: 'http://localhost:3000/api/auth/google/callback',
  scope: ['email','profile'],
  passReqToCallback: true
}, 
 async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await db.user.findFirst({where: {OauthId: profile.id}})
        if(user) {
          await db.user.update({where: {id: user.id}, data: {lastLogin: new Date()}})
          return done(null, {id: user.id, email: user.email, name: user.username, image: user.ProfilePicture ?? '', isPro: user.isPro})
        } else {
          const user = await db.user.create({data: {username: profile.displayName, email: profile.emails?.[0]?.value ?? '',ProfilePicture: profile.photos?.[0]?.value || null, OauthProvider: profile.provider.toUpperCase() as OauthProvider, OauthId: profile.id}})
          return done(null, {id: user.id, email: user.email, name: user.username, image: user.ProfilePicture ?? '', isPro: user.isPro})
        }
      } catch(err) {
         console.error(err)
         return done(err)
      }
 }
))

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: process.env.GITHUB_CALLBACK_URL || ''
},
async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any | false) => void) => {

     const provider = profile.provider === 'github' ? 'GITHUB' : 'GOOGLE'

   try {
      const user = await db.user.findFirst({where: {OauthId: profile.id}})
      if(user) {
        await db.user.update({where: {id: user.id}, data: {lastLogin: new Date()}})
        return done(null, {id: user.id, email: user.email, name: user.username, image: user.ProfilePicture, isPro: user.isPro})
      }
      else {
       const user = await db.user.create({data: {username: profile.username ?? '', email: profile.emails?.[0]?.value || '',lastLogin: new Date(), ProfilePicture: profile.photos?.[0]?.value || null, OauthProvider: provider, OauthId: profile.id}})
       return done(null, { id: user.id, email: user.email, name: user.username, image: user.ProfilePicture, isPro: user.isPro})
      }
   } catch(err) {
       console.error(err)
       return done(err)
   }
}
))
