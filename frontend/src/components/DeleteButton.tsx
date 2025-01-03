import { useAuth } from "@/lib/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axios from '../lib/utils';
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function DeleteButton({executionId}: { executionId: string}) {

    const queryClient = useQueryClient()
  
    const {mutateAsync: deleteExecution, isPending} = useMutation({
      mutationKey: ['deleteSnippet'],
      mutationFn: async (id: string) => {
         const { data: { msg } } = await axios.delete(`/api/codeExecution/delete/${id}`, { withCredentials: true}) 
         // await new Promise(r => setTimeout(r, 5000))
         return msg
      },
      onSuccess: () => {
         toast.success('CodeExecution deleted successfully')
      },
      onError: (err) => {
         console.error(err)
         if(err instanceof AxiosError) {
          toast.error(err.response?.data.msg || 'Failed to delete execution!')
         }
      }
    })

  return <button onClick={async () => {
       await deleteExecution(executionId)
       queryClient.refetchQueries({queryKey: ['getExecutions']})
  }} disabled={isPending} 
  className="disabled:bg-red-500/20 disabled:text-red-400 disabled:cursor-not-allowed absolute top-4 right-5 bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 px-3 py-1.5 rounded-lg duration-200 transition-all">
        {isPending ? (
        <div className="size-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
            ) : (
         <Trash2 className="size-5" /> 
        )}             
  </button>
}