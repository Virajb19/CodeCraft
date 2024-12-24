import { ExecutionResult, useCodeEditorStore, useLangStore } from "@/lib/store";
import { Loader2, Play } from "lucide-react"
import { useMutation } from '@tanstack/react-query'
import axios from "../lib/utils";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function RunButton() {

  // const { selectedLang } = useLangStore()
  const { isRunning, runCode, executionResult, language} = useCodeEditorStore()

  const { mutate: createCodeExecution} = useMutation({
    mutationFn: async (data: ExecutionResult & { language: string}) => {
       const { data: { id } } = await axios.post('/api/codeExecution/create', data, { withCredentials: true})
       return id
    },
    onError: (err) => {
       console.error(err)
       if(err instanceof AxiosError) {
          // toast.error(err.response?.status)
          toast.error(err.response?.data.message || 'Something went wrong') 
       }
    }
  })

  const handleRun = async () => {
       await runCode()

      //  alert(JSON.stringify(executionResult))

       const { executionResult } = useCodeEditorStore.getState()
      // alert(language)
       if(executionResult) {
          createCodeExecution({language, ...executionResult})
       }
  }

  return <button onClick={handleRun} disabled={isRunning} className="group flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse">
      {isRunning ? (
          <>
            <Loader2 className="size-5 text-white/70 animate-spin"/>
            <span className="text-white/90 font-semibold">Executing...</span>
          </>
      ) : (
        <>
          <Play className="size-5 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white"/>
          <span className="text-white/90 group-hover:text-white font-semibold">Run Code</span>
        </>
      )}
  </button>
}