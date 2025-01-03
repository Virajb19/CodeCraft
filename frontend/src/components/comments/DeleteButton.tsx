import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import axios from '../../lib/utils'
import { AxiosError } from 'axios'

export default function DeleteButton({commentId}: {commentId: string}) {

  const queryClient = useQueryClient()

    const {mutateAsync: deleteComment, isPending} = useMutation({
        mutationFn: async (commentId: string) => {
           const res = await axios.delete(`/api/user/delete/comment/${commentId}`, { withCredentials: true})
           await new Promise(r => setTimeout(r, 9000))
           return res.data
        },
        onSuccess: () => toast.success('Deleted'),
        onError: (err) => {
            console.error(err)
            if(err instanceof AxiosError) toast.error(err.response?.data.msg || 'Error deleting comment') 
            else toast.error('Something went wrong')
        }
      })
    

  return  <button onClick={async () => {
            await deleteComment(commentId)
            queryClient.refetchQueries({ queryKey: ['getComments']})
            }} disabled={isPending} className="absolute opacity-40 group-hover:opacity-100 transition-all top-3 right-5 p-2 rounded-lg hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:bg-transparent">  
            {isPending ? (
                <div className="size-5 border-2 border-red-900 rounded-full animate-spin border-t-red-500"/>
                ) : (
                <Trash2Icon className="size-5"/>
            )}
 </button>
}