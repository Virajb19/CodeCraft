import { Comment } from "@/lib/utils";
import { MessageSquare, User2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import CommentForm from "./CommentForm";
import { useQuery } from "@tanstack/react-query";
import axios from '../../lib/utils'
import { motion } from 'framer-motion'
import CommentContent from "./CommentContent";
import { useAuth } from "@/lib/useAuth";
import DeleteButton from "./DeleteButton";
import { toast } from 'sonner'
import EditComment from "./EditComment";

export default function Comments({snippetId, snippetUserId}: {snippetId: string, snippetUserId: number}) {

  // const [isPreview, setIsPreview] = useState(false)
  const commentsRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()

  const {data: comments, isFetching, isError} = useQuery<Comment[]>({
    queryKey: ['getComments', snippetId],
    queryFn: async () => {
      try {
        const { data: { comments}} = await axios.get(`/api/snippet/get/comments/${snippetId}`, { withCredentials: true})
        return comments 
      } catch(err) {
         console.error(err)
         throw new Error('Error fetching comments')
      }
    }, 
    refetchInterval: 1000 * 60 * 7  
  })

  // const [commentId, setCommentId] = useState('')

  // const {mutateAsync: deleteComment, isPending} = useMutation({
  //   mutationFn: async (commentId: string) => {
  //      const res = await axios.delete(`/api/user/delete/comment/${commentId}`, { withCredentials: true})
  //      await new Promise(r => setTimeout(r, 7000))
  //      return res.data
  //   },
  //   onMutate: (commentId) => setCommentId(commentId),
  //   onSettled: () => setCommentId(''),
  //   onSuccess: () => toast.success('Deleted'),
  //   onError: (err) => {
  //       console.error(err)
  //       if(err instanceof AxiosError) toast.error(err.response?.data.msg || 'Error deleting comment') 
  //       else toast.error('Something went wrong')
  //   }
  // })

  // toast.success(comments && comments[0].author.ProfilePicture)

  // if(isFetching || comments === undefined) return <div>

  // </div>

  if(isError) return <div className="border border-[#ffffff0a] text-lg bg-[#121218] rounded-xl h-40 flex-center text-red-600"> 
        Failed to load comments. Refresh!!!.
  </div>

  // if(comments?.length === 0) return <div></div>
  // if(!isFetching && comments?.length === 0) return <div></div>

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({
        top: commentsRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [comments, isFetching])

  return <div className="border border-[#ffffff0a] bg-[#121218] rounded-xl p-2 flex flex-col gap-2">
            <div className="flex items-center justify-between p-4 mb-2 gap-2 font-semibold border-b-[3px] border-[#ffffff0a]">
                <div className="flex items-center gap-2">
                    <MessageSquare className="size-5"/>
                    Comments ({comments?.length})
                </div>   
                {/* <button onClick={() => setIsPreview(!isPreview)}
                 className={twMerge('text-base border px-3 py-1.5 rounded-md transition-colors', isPreview ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-[#ffffff08] text-gray-400')}>
                    {isPreview ? 'Edit' : 'Preview'}
                </button>        */}
            </div>

            {snippetUserId !== user?.id && <CommentForm snippetId={snippetId}/>}

            <div ref={commentsRef} id="comments" className="flex flex-col gap-2 border rounded-lg mt-3 p-3 max-h-[calc(100vh-7rem)] overflow-y-scroll">
                {isFetching ? (
                     <div className="size-12 self-center my-20 rounded-full animate-spin border-4 border-white/30 border-t-white"/>
                ) : comments?.length === 0 ? (
                    <h3 className="text-lg text-gray-500 self-center my-20">No comments found!!!</h3>
                ) : (
                   <>
              {comments?.map((comment, i) => {
                  
                  const picture = comment.author.ProfilePicture
                  const name = comment.author.username

                  // toast.success(picture)

                   return <motion.div initial={{y: -4, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{ease: 'backOut', delay: 0.05 * i}}
                       key={comment.id} className="relative group flex flex-col gap-2 p-4 rounded-lg bg-[#0a0a0f] border border-[#ffffff0a] hover:border-gray-700 duration-200 transition-all">
                        <div className="flex gap-2">
                          {picture ? (
                            <img src={picture} width={40} height={40} className="object-contain rounded-full"/>
                          ) : (
                            <span className="bg-[#ffffff08] p-3 rounded-full">
                               <User2 className="size-5 text-[#808086]"/>                             
                            </span>
                          )}

                          <div className="flex flex-col text-sm">
                              <span className="text-[#e1e1e3] font-semibold truncate">{name}</span>
                              <span className="text-[#808086]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* <CommentContent content={comment.content}/> */}
                        <div className="line-clamp-10">
                          {comment.content.split('\n').map((line,i) => {
                             return <p key={i} className="text-sm">{line}</p>
                          })}
                        </div>

                       {comment.userId === user?.id && (
                        <div className="flex items-center gap-2 absolute top-3 right-5">
                             <EditComment comment={comment} snippetId={snippetId}/>
                             <DeleteButton commentId={comment.id} snippetId={snippetId}/>
                        </div>
                       )}
                   </motion.div>
                })}
              </>
                )}
      </div>
  </div>
}