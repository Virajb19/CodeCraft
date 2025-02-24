import { Monitor } from 'lucide-react';

export default function DesktopOnly() {
  return <div className="w-full min-h-screen flex-center flex-col gap-4 px-2">
        <Monitor className='size-14'/>
        <h1 className='font-semibold text-3xl md:text-4xl'>Desktop Only</h1>
        <p className='text-center md:text-xl'>This website is not responsive. Please visit it on your laptop or desktop</p>
  </div>
}