import EditorPanel from "@/components/editor-panel";

export default function HomePage() {

  return <div className="w-full min-h-screen flex">
      {/* <button onClick={async () => {
        window.open('/api/auth/callback/github')
      }} className="rounded-sm p-3 bg-red-900">Sign up</button> */}
      <div className="mt-24 border-4 w-full p-3 flex gap-2">
         <EditorPanel />
      </div>
  </div>
} 