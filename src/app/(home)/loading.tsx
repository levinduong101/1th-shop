import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className='fixed inset-0 z-9999 grid place-items-center bg-black/20'>
      <LoaderCircle className='text-red h-10 w-10 animate-spin' />
    </div>
  );
}
