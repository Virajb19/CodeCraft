import { useQuery } from "@tanstack/react-query"
import axios, { Comment } from "../lib/utils"
import { useNavigate, useParams } from "react-router-dom"
import SnippetCard from "@/components/SnippetCard";
import { Editor } from "@monaco-editor/react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../constants";
import { Code } from 'lucide-react'
import CopyButton from "@/components/CopyButton";
import Comments from "@/components/Comments";

type Snippet = {
  id: string;
  createdAt: Date;
  title: string;
  language: string;
  code: string;
  userId: number;
  comments: Comment[]
} | null

export default function Snippet() {

    const { id } = useParams()
    const navigate = useNavigate()

    const {data: snippet, isLoading} = useQuery<Snippet>({
      queryKey: ['getSnippet', id],
      queryFn: async () => {
         try {
            const { data: { snippet } } = await axios.get(`/api/snippet/getSnippet/${id}`, { withCredentials: true})
            // await new Promise(r => setTimeout(r, 7000)),
            return snippet
         } catch(err) {
           console.error(err)
           throw new Error('Error fetching snippet')
         }
      },
      enabled: !!id
    })

    if(!snippet) {
      navigate('/editor')
      return null
    }

  return <div className="w-3/4 mx-auto min-h-screen flex flex-col gap-4 p-3">
        <SnippetCard snippet={snippet}/>
         <div className="flex flex-col rounded-t-2xl border border-[#ffffff0a] bg-[#121218]">
            <div className="flex items-center justify-between p-3 border-b border-[#ffffff0a]">
                 <div className="text-[#808086] flex items-center gap-2">
                    <Code className="size-5"/>
                    <span className="font-semibold">Source Code</span>
                 </div>
                 <CopyButton code={snippet.code}/>
            </div>
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[snippet.language.toLowerCase()].monacoLanguage}
              value={snippet.code}
              theme="vs-dark"
              beforeMount={defineMonacoThemes}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                readOnly: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
              }}
            />
         </div>
         <Comments snippetId={snippet.id} snippetUserId={snippet.userId}/>
  </div>
}