import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import db from './db'
 
export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: 'postgresql'
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID!, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET!, 
            redirectURI: `${process.env.APP_URL}/api/auth/callback/github`
           } 
    },
    trustedOrigins: [process.env.CLIENT_BASE_URL as string]
})