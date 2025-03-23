import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from '../lib/utils'
import { Star } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'

export default function StarButton({snippetId} : {snippetId: string}) {

  // const [isStarred, setIsStarred] = useLocalStorage(`isStarred-${snippetId}`,false)
  // const [starCount, setStarCount] = useState(0)

  const queryClient = useQueryClient()

  const {data: starCount} = useQuery<number>({
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

  const {data: isStarred} = useQuery<boolean>({
    queryKey: ['isStarred', snippetId],
    queryFn: async () => {
      try {
        const { data: { isStarred}} = await axios.get(`/api/snippet/isStarred/${snippetId}`, { withCredentials: true})
        return isStarred
      } catch(err) {
        console.error(err)
        throw new Error('error')
      }
    }
  })

  // USE OPTIMISTIC UPDATE
  const {mutateAsync: starSnippet, isPending} = useMutation<{isStarred: boolean, starCount: number}>({
    mutationKey: ['star', snippetId],
    mutationFn: async () => {
        const res = await axios.post(`/api/snippet/star/${snippetId}`, null, { withCredentials: true})
        // await new Promise(r => setTimeout(r,5000))
        return res.data
    },
    // onMutate: () => {
    //   React state updation is async (React batching)
    //   Never cancel a mutation unlike query try to prevent it from being fired instead
    //   How to rollback if mutation updates the table in DB then it is cancelled??
    //  setIsStarred(prev => !prev)
    //  setStarCount(prev => isStarred ? prev - 1 : prev + 1)
    // },
    onSuccess: ({ isStarred }) => {
      //  setIsStarred(isStarred)
      //  setStarCount(starCount)
      toast.success(isStarred ? 'Starred' : 'Removed star', { icon: isStarred && <Star className='fill-yellow-500 text-yellow-500 size-5'/>})
    },
    onError: (err) => {
      console.error(err)
      // setIsStarred(prev => !prev)
      // setStarCount(prev => isStarred ? prev + 1 : prev - 1)
    },
    onSettled: async () => {
      await queryClient.refetchQueries({queryKey: ['isStarred']})
      await queryClient.refetchQueries({queryKey: ['getStarCount']})
    }
  })

  // const isStarred = data?.isStarred || false
  // const starCount = data?.starCount || 0

  return <button disabled={isPending} onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toast.promise(starSnippet(), { loading: isStarred ? 'Removing...': 'Starring...', error: 'Something went wrong!'})
  }} className={twMerge('flex items-center gap-2 px-3 py-1.5 rounded-lg disabled:cursor-not-allowed disabled:opacity-80', isStarred ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20')}>
           <Star className={twMerge('size-5', isStarred ? "fill-yellow-500" : 'fill-none hover:fill-gray-400 hover: transition-colors duration-200')}/>
           <span className={twMerge('text-xs font-semibold', isStarred ? 'text-yellow-500' : 'text-gray-400')}>{starCount && (starCount< 100 ? starCount : '100+')}</span>
  </button>
}