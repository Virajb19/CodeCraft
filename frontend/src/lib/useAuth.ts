import { useQuery } from "@tanstack/react-query"
import axios from '../lib/utils'
import { useState } from "react"

export const useAuth = () => {
    const [user, setUser] = useState<{ id: number, email: string, name: string, image: string | null} | null>(null)

    const {isLoading} = useQuery({
        queryKey: ['getUser'],
        queryFn: async () => {
            try {
               const { data: {user}} = await axios.get('/api/auth/check', {withCredentials: true})
               setUser(user)
               return user
            } catch(err) {
                setUser(null)
            }
        }
    })

    return { user, isLoading}
}