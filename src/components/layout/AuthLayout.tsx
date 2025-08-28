'use client';

import { useAuthStore } from '@/src/store/authStore';
import { LoaderCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pinCode = useAuthStore((state) => state.pinCode);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Wait until hydrated
  if (!isClient || !hasHydrated) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-black/10'>
        <LoaderCircle className='mx-auto h-10 animate-spin' />
      </div>
    );
  }

  // Check pinCode
  if (!pinCode) {
    redirect('/landing');
  }

  return <>{children}</>;
}
