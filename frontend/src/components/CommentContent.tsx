import CodeBlock from "./CodeBlock"

export default function CommentContent({content}: {content: string}) {

  const parts = content.split(/(```[\w-]*\n[\s\S]*?\n```)/g)

  return <div className="border p-1 line-clamp-6">
            {parts.map((part,i) => {
               if(part.startsWith("```")) {
                    const match = part.match(/```([\w-]*)\n([\s\S]*?)\n```/)

                    if(match) {
                    const [, language, code] = match
                    return <CodeBlock code={code} language={language} key={i}/>
                  }
               }
               
               return part.split('\n').map((line, idx) => {
                 return <p key={idx} className="mb-4 text-gray-300">
                   {line}
                 </p>
               })
            })}
  </div>
}