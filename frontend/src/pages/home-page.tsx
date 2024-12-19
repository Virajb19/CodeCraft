
export default function HomePage() {

  return <div className="w-full min-h-screen flex-center">
      <button onClick={async () => {
        window.open('/api/auth/callback/github')
      }} className="rounded-sm p-3 bg-red-900">Sign up</button>
  </div>
} 