import { useEffect, useState } from "react"
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from './ui/form'
import { ShareIcon } from 'lucide-react'
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCodeEditorStore } from "@/lib/store";
import axios from '../lib/utils';
import { toast } from "sonner";
import { Loader } from 'lucide-react'

type Input = { title: string }

export default function SaveButton() {

    const [open, setOpen] = useState(false)
    const { language, getCode } = useCodeEditorStore()

    const form = useForm<Input>({
        resolver: zodResolver(z.object({ title: z.string().min(1, { message: 'Please enter a title'}).max(15)})),
        defaultValues: { title: ''}
    })

    const {mutateAsync: createSnippet} = useMutation({
     mutationFn: async (data: { title: string, language: string, code: string}) => {
          const res = await axios.post('/api/snippet/create', data, { withCredentials: true}) 
          // await new Promise(r => setTimeout(r, 5000))
          setOpen(false)
          return res.data
     },
     onSuccess: () => {
        toast.success('Saved successfully', { position: 'top-center'})
     },
     onError: (err) => {
          console.error(err)
          toast.error('Failed to save code. Try again !!!', { position: 'top-center'})
     } 
    }) 

    useEffect(() => {
     const openDialog = (e: KeyboardEvent) => {
        if(e.ctrlKey && e.key === 'k') {
          setOpen(prev => !prev)
        }
     }
       document.addEventListener('keydown', openDialog)
       return () => document.removeEventListener('keydown', openDialog)
    }, [])

  async function onSubmit(data: Input) {
     const code = getCode()
     await createSnippet({title: data.title, language, code})
  }

  return <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger>
          <button className="flex group items-center gap-3 opacity-75 font-semibold hover:opacity-100 duration-200 transition-opacity px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <ShareIcon className="size-4 group-hover:-translate-y-1 duration-300" strokeWidth={3}/>Save
        </button>
       </DialogTrigger>
       <DialogContent>
            <DialogHeader>
                 <DialogTitle className="text-xl">Save Snippet</DialogTitle>
            </DialogHeader>
                <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                     <FormField
                          control={form.control}
                          name='title'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <input className="input-style bg-[#161622]" {...field} type="text" placeholder="Enter a title"/>
                              </FormControl>
                              <FormMessage className="text-base"/>
                             </FormItem>
                          )}
                        />

                         <div className="flex items-center justify-end gap-3">
                          <button onClick={() => setOpen(false)} type="button" className="py-2 px-5 rounded-md bg-red-600 opacity-80 hover:opacity-100 duration-200">Cancel</button>
                          <button disabled={form.formState.isSubmitting} type="submit" className="flex items-center gap-2 py-2 px-5 rounded-md bg-gradient-to-l from-blue-500 to-blue-600 disabled:cursor-not-allowed disabled:opacity-70">
                              {form.formState.isSubmitting && <Loader className="animate-spin"/>}
                              {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                           </button>
                         </div>

                     </form>
                </Form>
       </DialogContent>
  </Dialog>
}