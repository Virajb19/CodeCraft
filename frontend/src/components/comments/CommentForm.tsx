import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '../ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Code, SendIcon, CheckCheck, CheckCircle} from 'lucide-react'
import { z } from 'zod' 
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from 'tailwind-merge'
import axios from '../../lib/utils'
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react'
import { AxiosError } from 'axios'

const commentSchema = z.object({
    content: z.string().min(1, { message: 'Comment first'}).max(500, { message: 'Content cannot exceed 500 characters'})
})

type Input = z.infer<typeof commentSchema>

export default function CommentForm({snippetId}: {snippetId: string}) {

    const [isPosted, setIsPosted] = useState(false)

    const queryClient = useQueryClient()

    const form = useForm<Input>({
        resolver: zodResolver(commentSchema),
        defaultValues: { content: ''}
    })

    const {mutateAsync: postComment, isPending} = useMutation({
        mutationFn: async (data: Input) => {
           const res = await axios.post(`/api/user/post/comment/${snippetId}`, data, {withCredentials: true})
           return res.data
        },
        onSuccess: () => {
            toast.success('posted', { icon: <CheckCheck className="text-green-600 size-5"/>})
            setIsPosted(true)
            setTimeout(() => setIsPosted(false), 2500)
            queryClient.refetchQueries({ queryKey: ['getComments']})
        },
        onError: (err) => {
            console.error(err)
            if(err instanceof AxiosError) {
                toast.error(err.response?.data.msg || 'Error posting comment!!!')
            }
        }
      }) 

    async function onSubmit(data: Input) {
        await postComment(data)
        form.reset()
      }
  
      function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
          if(e.key === 'Tab') {
             e.preventDefault()
             const start = e.currentTarget.selectionStart
             const end = e.currentTarget.selectionEnd
  
            //  toast.success(start + ' ' + end, { icon: <CheckCheck className="text-green-400 size-5"/>})
  
            // form.setValue('content', form.getValues('content').substring(0,start) + ' ' + form.getValues('content').substring(0,end))
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2
          }
      }
  

  return  <div className="p-6 bg-[#0a0a0f] rounded-xl border-[#ffffff0a]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                                
                <FormField
                    control={form.control}
                    name='content'
                    render={({ field, fieldState }) => (
                        <FormItem className='flex flex-col gap-1'>
                        <FormLabel></FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <FormControl>
                                <textarea onKeyDown={handleKeyDown} className={twMerge("input-style bg-[#161622] text-[#e1e1e3] p-2 font-mono min-h-40 resize-none placeholder:text-[#808086]", fieldState.error && '')} {...field} placeholder="Write a comment..."/>
                            </FormControl>
                                </TooltipTrigger>

                                {fieldState.error && (
                                    <TooltipContent side="top" sideOffset={12} className="bg-red-600 ring-0 rounded-lg text-lg shadow-md tracking-wide">
                                        {/* {form.formState.errors.content?.message} */}
                                        {fieldState.error.message}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                            </TooltipProvider>
                        {/* <FormMessage className="text-base"/> */}
                        </FormItem>
                    )}
                    />

                    <div className="flex items-center justify-between px-4 py-3 mt-2 bg-[#080809] border-t-4 border-[#ffffff0a]">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[#808086]">
                                <Code className="size-5"/>
                                <span>Format code with ```language</span>
                            </div>
                                <p className="text-[#808086]/60 ml-6"> Tab key inserts spaces • Preview your comment before posting</p>
                        </div>

                        <button disabled={form.formState.isSubmitting || isPosted} type="submit" 
                        className={twMerge("flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ml-auto disabled:opacity-70 disabled:cursor-not-allowed", 
                            isPosted ? 'bg-green-400/10' : 'bg-[#3b82f6] hover:bg-[#2563eb]'
                        )}>
                        {form.formState.isSubmitting ? (
                            <>
                                <div className="size-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"/>
                                <span>Posting...</span>
                            </>
                        ) : isPosted ? (
                           <>
                             <CheckCircle className='size-4 text-green-700'/>
                             <span className='text-green-500'>Posted !</span>
                           </>
                        ) : (
                            <>
                            <SendIcon className="size-4"/> Comment                                  
                            </>
                        )}
                        </button>
                    </div>

                </form>
            </Form>
     </div>

}