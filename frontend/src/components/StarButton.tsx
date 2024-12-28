import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '../lib/utils'
import { Star } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useState } from 'react'
import { toast } from 'sonner'
import { useLocalStorage } from 'usehooks-ts'

export default function StarButton({snippetId} : {snippetId: string}) {

  // USE LOCAL STORAGE OR SEE CONVEX/SNIPPETS.TS fire a query
  const [isStarred, setIsStarred] = useLocalStorage(`isStarred-${snippetId}`,false)
  const [starCount, setStarCount] = useState(0)

  const {data: count} = useQuery<number>({
    queryKey: ['getStarCount', snippetId],
    queryFn: async () => {
       try {
          const { data: {starCount}} = await axios.get(`/api/snippet/star/${snippetId}`, { withCredentials: true})
          return starCount
       } catch(err) {
        console.error(err)
        throw new Error('Error')
       }
    }
  })

  const {mutate: starSnippet, isPending} = useMutation<{isStarred: boolean, starCount: number}>({
    mutationKey: ['star', snippetId],
    mutationFn: async () => {
        const res = await axios.post(`/api/snippet/star/${snippetId}`, null, { withCredentials: true})
        // await new Promise(r => setTimeout(r,5000))
        return res.data
    },
    onMutate: () => {
      // React state updation is async (React batching)
      // Never cancel a mutation unlike query try to prevent it from being fired instead
      // How to rollback if mutation updates the table in DB then it is cancelled??
     setIsStarred(prev => !prev)
     setStarCount(prev => isStarred ? prev - 1 : prev + 1)
    },
    onSuccess: ({ isStarred, starCount}) => {
       setIsStarred(isStarred)
       setStarCount(starCount)
       toast.success('success')
    },
    onError: (err) => {
      console.error(err)
      setIsStarred(prev => !prev)
      setStarCount(prev => isStarred ? prev + 1 : prev - 1)
    }
  })

  // const isStarred = data?.isStarred || false
  // const starCount = data?.starCount || 0

  return <button disabled={isPending} onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        // const id = toast.loading('Starring...')
        starSnippet()
        // toast.dismiss(id)
  }} className={twMerge('flex items-center gap-2 px-3 py-1.5 rounded-lg', isStarred ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20')}>
           <Star className={twMerge('size-5', isStarred ? "fill-yellow-500" : 'fill-none hover:fill-gray-400 hover: transition-colors duration-200')}/>
           <span className={twMerge('text-xs font-semibold', isStarred ? 'text-yellow-500' : 'text-gray-400')}>{count && (count < 100 ? count : '100+')}</span>
  </button>
}