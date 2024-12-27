import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type Props = {
    code: string,
    language: string
}

export default function CodeBlock({code, language}: Props) {

    const [isExpanded, setIsExpanded] = useState(false)
    const lines = code.split('\n')
    const displayCode = isExpanded ? code : lines.slice(0,6).join('\n')

  return <div className="relative">
        {/* {JSON.stringify({code, language})} */}
        <SyntaxHighlighter
        language={language.toLowerCase()}
        style={atomOneDark}
        customStyle={{
          padding: "1rem",
          borderRadius: "0.5rem",
          background: "rgba(0, 0, 0, 0.4)",
          margin: 0,
        }}
      >
        {displayCode}
      </SyntaxHighlighter>
       
       {lines.length > 6 && (
         <button onClick={() => setIsExpanded(!isExpanded)} className="absolute flex items-center gap-2 bottom-2 right-5 border px-2 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200">
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp className="size-4"/>
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="size-4"/>
                    </>
                  )}
         </button>
       )}
  </div>
}