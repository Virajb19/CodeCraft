import EditorPanel from "@/components/editor-panel";
import OutputPanel from "@/components/OutputPanel";

export default function HomePage() {

  return <div className="w-full min-h-screen flex">
      {/* <button onClick={async () => {
        window.open('/api/auth/callback/github')
      }} className="absolute top-1/2 left-1/2 z-50 rounded-sm p-3 bg-red-900">Sign up</button> */}
      <div className="mt-24 w-full p-3 flex items-center gap-2">
         <EditorPanel />
         <OutputPanel />
      </div>
  </div>
} 