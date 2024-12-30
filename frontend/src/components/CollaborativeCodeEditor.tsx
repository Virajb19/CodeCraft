import { Editor } from "@monaco-editor/react";
import { motion } from 'framer-motion'
import { editor } from "monaco-editor";
import { useCallback, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { useDebounceCallback } from 'usehooks-ts'

type Props = {
    socket: Socket | null,
    roomId: string
}

export default function CollaborativeCodeEditor({socket, roomId}: Props) {

    const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null)
    const [code, setCode] = useState('')

    const debounced = useDebounceCallback(setCode, 300)

    const handleCodeChange = useCallback((val: string | undefined) => {
       if(val) setCode(val)
    }, [])

    useEffect(() => {
        socket?.emit('code-change', {
            roomId,
            code
        })   
        // toast.info(code)  
    }, [code])

    useEffect(() => {
       socket?.on('code-change', ({ code }) => {
          editor?.setValue(code)
        // setCode(code)
       })

       return () => {
         socket?.off('code-change')
       }
    }, [])

  return  <motion.div initial={{x: '100%'}} animate={{x: 0}} transition={{duration: 0.7, ease: 'easeInOut', bounce: 2}} className="grow">
            <Editor 
            language="javascript"
            onChange={handleCodeChange}
            onMount={editor => setEditor(editor)}
            value={code}
            theme="vs-dark"
            options={{
            minimap: { enabled: false },
            fontSize: 16,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderWhitespace: "selection",
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            renderLineHighlight: "all",
            lineHeight: 1.6,
            letterSpacing: 0.5,
            roundedSelection: true,
            scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
            }
            }}
        />
</motion.div>
}