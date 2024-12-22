import { create } from 'zustand'
import { editor } from 'monaco-editor';
import { LANGUAGE_CONFIG } from '@/constants';
import axios from 'axios';

type selectedLang = {
    selectedLang: string,
    setSelectedLang: (lang: string) => void 
}

export type ExecutionResult =  {
    code: string;
    output: string;
    error: string | null;
  }

type CodeEditorState = {
    language: string;
    output: string;
    isRunning: boolean;
    error: string | null;
    theme: string;
    fontSize: number;
    editor: editor.IStandaloneCodeEditor | null;
    executionResult: ExecutionResult | null; 
  
    setEditor: (editor: editor.IStandaloneCodeEditor) => void;
    getCode: () => string;
    setCode: () => void;
    setTheme: (theme: string) => void;
    setFontSize: (fontSize: number) => void;
    setLanguage: (language: string) => void
    runCode: () => Promise<void>;
  }

export const useLangStore = create<selectedLang>((set) => ({
    selectedLang: localStorage.getItem('lang') || 'Javascript',
    setSelectedLang: (lang) => {
       localStorage.setItem('lang', lang)
       set({selectedLang: lang})
    }
}))

export const useCodeEditorStore = create<CodeEditorState>((set, get) => ({
    editor: null,
    isRunning: false,
    error: null,
    executionResult: null,
    output: "",
    language: localStorage.getItem('lang') || '', // This is initial value this value is given once on initial render or mount 
    theme: localStorage.getItem('editor-theme') || 'vs-dark',
    fontSize: Number(localStorage.getItem('font-size') || '16'),
    setEditor: (editor: editor.IStandaloneCodeEditor) => {
       const savedCode = localStorage.getItem(`editor-code-${get().language}`)
       if(savedCode && editor) editor.setValue(savedCode)
       set({editor})
    },
    getCode: () => get().editor?.getValue() || "",
    setCode: () => {
        const currentCode = get().editor?.getValue()
        if(currentCode) {
            localStorage.setItem(`editor-code-${get().language}`, currentCode)
        }

        set({error: null, output: ""})
    },
    setFontSize: (fontSize: number) => {
        localStorage.setItem('font-size', fontSize.toString())
        set({ fontSize })
    },
    setTheme: (theme: string) => {
        localStorage.setItem('editor-theme', theme)
        set({ theme })
    },
    setLanguage: (language: string) => {
      localStorage.setItem('lang', language)
      set({ language })
    },
    runCode: async () => {
        const { language, getCode } = get()
        const code = getCode()
        // alert(language)
        if (!code) {
            set({ error: "Please enter some code" })
            return;
          }
    
      set({ isRunning: true, error: null, output: "" })

      // await new Promise(r => setTimeout(r, 2000))

      try {
          const runtime = LANGUAGE_CONFIG[language.toLowerCase()].pistonRuntime
          const { data } = await axios.post('https://emkc.org/api/v2/piston/execute', 
            {
              language: runtime.language,
              version: runtime.version,
              files: [{ content: code }]
            }
          )
          
          if (data.message) {
            set({ error: data.message, executionResult: { code, output: "", error: data.message } })
            return
          }

          if (data.compile && data.compile.code !== 0) {
            const error = data.compile.stderr || data.compile.output
            set({ error, executionResult: { code, output: "", error } })
            return
          }

          if (data.run && data.run.code !== 0) {
            const error = data.run.stderr || data.run.output
            set({ error, executionResult: { code, output: "", error } })
            return
          }
  
          const output = data.run.output;

          set({ output: output.trim(), error: null, executionResult: { code, output: output.trim(), error: null } })
  
      } catch(err) {
        console.error(err)
        set({
            error: "Error running code",
            executionResult: { code, output: "", error: "Error running code" },
          })
      } finally {
        set({ isRunning: false})
      }
    
    } 
}))