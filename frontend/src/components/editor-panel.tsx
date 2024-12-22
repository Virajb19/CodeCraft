import { useCodeEditorStore, useLangStore } from "@/lib/store"
import { Editor } from "@monaco-editor/react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../constants";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditorPanel() {

  // let { selectedLang: lang } = useLangStore()
  // lang = lang.toLowerCase()

  let { language: lang } = useCodeEditorStore()
  lang = lang.toLowerCase()

  const {setFontSize, setEditor, theme, fontSize, editor } = useCodeEditorStore()

  const handleEditorChange = (value: string | undefined) => {
    if(value) localStorage.setItem(`editor-code-${lang}`, value)
  }

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${lang}`);
    const newCode = savedCode || LANGUAGE_CONFIG[lang].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [lang,editor])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
   setIsMounted(true)
  }, [])

  if(!isMounted) return null

  return <div className="w-[55%] p-1">
        <div className="flex items-center justify-between">
           <div className="flex gap-2">
             <img src={`/${lang}.png`} width={30} height={30} className="rounded-sm"/>
             <div className="flex flex-col">
                <h2 className="text-sm font-medium text-white">Code Editor</h2>
                <p className="text-xs text-gray-500">Write and execute your code</p>
             </div>
           </div>

           <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
                    <TypeIcon className="size-4 text-gray-400" />
                    <input onChange={e => setFontSize(parseInt(e.target.value))} className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer" type="range" min={12} max={24} value={fontSize} />
                    <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                      {fontSize}
                    </span>
                </div>
                 <button onClick={() => {
                    editor?.setValue(LANGUAGE_CONFIG[lang].defaultCode)
                 }}  
                   className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors group">
                   <RotateCcwIcon className="size-4 text-gray-400" />
                 </button>
            </div>
      </div>
      <div className="rounded-xl overflow-hidden ring-1 ring-white/[0.05] mt-2">
      <Editor
              height="600px"
              language={LANGUAGE_CONFIG[lang]?.monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
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
                },
              }}
            />
      </div>
  </div>
}