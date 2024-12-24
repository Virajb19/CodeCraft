import EditorPanel from "@/components/editor-panel";
import Navbar from "@/components/Navbar";
import OutputPanel from "@/components/OutputPanel";

export default function EditorPage() {

  return <div className="w-full min-h-screen flex">
      {/* <button onClick={() => {
        window.open('http://localhost:3000/api/auth/github', "_self")
      }} className="absolute top-1/2 left-1/2 z-50 rounded-sm p-3 bg-red-900">Sign up</button> */}
      <Navbar />
      <div className="mt-24 w-full p-3 flex items-center gap-2">
         <EditorPanel />
         <OutputPanel />
      </div>
  </div>
} 