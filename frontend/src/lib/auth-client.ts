import { createAuthClient } from "better-auth/react"
import { SERVER_URL } from "./utils"

export const authClient = createAuthClient({
    baseURL: SERVER_URL
})

export const { signIn, signUp, useSession } = createAuthClient()