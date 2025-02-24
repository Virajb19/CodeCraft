import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import axios, { Comment } from '../../lib/utils'
import { AxiosError } from 'axios'

export default function DeleteButton({commentId, snippetId}: {commentId: string, snippetId: string}) {

  const queryClient = useQueryClient()

    const {mutateAsync: deleteComment, isPending} = useMutation({
        mutationFn: async (commentId: string) => {
            // await new Promise(r => setTimeout(r, 5000))
            // throw new Error('err')
           const res = await axios.delete(`/api/user/delete/comment/${commentId}`, { withCredentials: true}) 
           return res.data
        },
        onMutate: async (commentId: string) => {
           await queryClient.cancelQueries({ queryKey: ['getComments']})

           const prevComments = queryClient.getQueryData<Comment[]>(['getComments', snippetId])

          // toast.success(JSON.stringify(prevComments))

           queryClient.setQueryData(['getComments', snippetId], (old: Comment[]) => {
              if(!old) return 
              return old.filter(comment => comment.id !== commentId)
           })

           return { prevComments }
        },
        onSuccess: () => toast.success('Deleted'),
        onError: (err, commitId , context) => {
            console.error(err)
            if(err instanceof AxiosError) toast.error(err.response?.data.msg || 'Error deleting comment') 
            else toast.error('Something went wrong')

            queryClient.setQueryData(['getComments', snippetId], context?.prevComments)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['getComments', snippetId]})
        }
      })
    
  return  <button onClick={async () => {  
             await deleteComment(commentId)
            // queryClient.refetchQueries({ queryKey: ['getComments']})
            }} disabled={isPending} className="opacity-40 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-500/20 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:bg-transparent">  
            {isPending ? (
                <div className="size-5 border-2 border-red-900 rounded-full animate-spin border-t-red-500"/>
                ) : (
                <Trash2Icon className="size-5"/>
            )}
 </button>
}