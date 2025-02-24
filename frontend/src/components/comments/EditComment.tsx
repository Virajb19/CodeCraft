import { Edit, Pencil, Loader2 } from 'lucide-react'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { twMerge } from 'tailwind-merge';
import { Comment } from '@/lib/utils';

const editCommentSchema = z.object({
  newContent: z.string().min(1)
})

type Input = z.infer<typeof editCommentSchema>

export default function EditComment({ comment, snippetId } : { comment: Comment, snippetId: string}) {

  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const editComment = useMutation({
    mutationFn: async (data: Input) => {
      //  await new Promise(r => setTimeout(r, 5000))
       const res = await axios.put(`/api/user/edit/comment/${comment.id}`, data)
       return res.data
    },
    onSuccess: () => toast.success('Edited'),
    onError: (err) => {
       console.error(err)
       toast.error('Error editing comment')
    },
    onSettled: () => {
      setIsOpen(false)
      queryClient.refetchQueries({ queryKey: ['getComments', snippetId]})
    }
  })

  const form = useForm<Input>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: { newContent: comment.content }
  })

 async function onSubmit(data: Input) {
     await editComment.mutateAsync(data)
  }

  form.watch()

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <button className="opacity-40 hover:opacity-100 p-2 rounded-lg hover:bg-blue-600/15 duration-300">
                  <Edit />  
        </button>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader>
               <DialogTitle className='flex items-start gap-3'>Edit your comment</DialogTitle>
          </DialogHeader>
          <Form {...form}>
              <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField 
                   control={form.control}
                   name='newContent'
                   render={({ field }) => {
                      return <FormItem>
                        <FormControl>
                          <textarea className={twMerge("input-style bg-[#161622] text-[#e1e1e3] w-full p-2 font-mono min-h-40 resize-none placeholder:text-[#808086]")} {...field} placeholder="Write a comment..."/>
                        </FormControl>
                      </FormItem>
                   }}
                  />

                  <button disabled={form.formState.isSubmitting || form.watch('newContent') === ''} className='px-3 py-2 text-lg bg-[#3b82f6] hover:bg-[#2563eb] duration-200 rounded-xl flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70'>
                    {editComment.isPending ? (
                       <>
                         <Loader2 className='animate-spin'/> Editing...
                       </>
                    ) : (
                      <>
                        <Pencil className='size-5'/> Edit
                      </>
                    )}
                    </button>
              </form>
          </Form>
      </DialogContent>
  </Dialog>

}