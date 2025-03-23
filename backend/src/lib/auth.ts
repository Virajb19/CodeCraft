import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import db from './db'
 
export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: 'postgresql'
    }),
    socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
           } 
    },
    trustedOrigins: [process.env.CLIENT_BASE_URL as string]
})