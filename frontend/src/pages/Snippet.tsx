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
    const {data: snippet} = useQuery<Snippet | null>({
      queryKey: ['getSnippet', id],
      queryFn: async () => {
         try {
            const { data: { snippet }} = await axios.get(`/api/snippet/getSnippet/${id}`)
            return snippet
         } catch(err) {
          console.error(err)
          throw new Error('Error fetching snippet')
         }
      }
    })

    if(!snippet) navigate('/editor')


  return <div className="w-full min-h-screen flex-center">
        {snippet?.id}
  </div>
}