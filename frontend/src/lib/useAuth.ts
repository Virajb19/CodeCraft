import { useQuery } from "@tanstack/react-query"
import axios from '../lib/utils'

type User = { id: number, email: string, name: string, image: string | null, isPro: boolean} | null

export const useAuth = () => {

    const {data: user,isLoading, isFetching} = useQuery<User>({
        queryKey: ['getUser'],
        queryFn: async () => {
            try {
               const { data: {user}} = await axios.get('/api/auth/check', {withCredentials: true})
               return user
            } catch(err) {
                 throw new Error('Error')
            }
        }
    })

    return { user, isLoading}
}