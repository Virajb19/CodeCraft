import { createAuthClient } from "better-auth/react"
import { BACKEND_URL } from "./utils"

export const authClient = createAuthClient({
    baseURL: BACKEND_URL
})

export const { signIn, signUp, useSession } = createAuthClient()