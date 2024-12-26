import { useQuery } from "@tanstack/react-query"
import axios from "../lib/utils"
import { useNavigate, useParams } from "react-router-dom"

type Snippet = {
  id: string;
  createdAt: Date;
  title: string;
  language: string;
  code: string;
  userId: number;
} | null

export default function Snippet() {

    const { id } = useParams()
    const navigate = useNavigate()
    console.log(id)
    const {data: snippet} = useQuery<Snippet>({
      queryKey: ['getSnippet', id],
      queryFn: async () => {
         try {
            const { data } = await axios.get(`/api/snippet/getSnippet/${id}`)
            console.log(snippet)
            return data.snippet || null
         } catch(err) {
           console.error(err)
           return null
          //  throw new Error('Error fetching snippet')
         }
      },
      enabled: !!id
    })

    if(!snippet) {
      navigate('/editor')
      return null
    }

  return <div className="w-full min-h-screen flex-center">
        {snippet?.id}
  </div>
}