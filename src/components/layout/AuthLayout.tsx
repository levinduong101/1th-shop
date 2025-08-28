'use client';

import { useAuthStore } from '@/src/store/authStore';
import { LoaderCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isValidPinCode = useAuthStore((state) => state.isValidPinCode);
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

  // Check valid pinCode
  if (!isValidPinCode()) {
    toast.error('Session expired. Please log in again.');
    redirect('/landing');
  }

  return <>{children}</>;
}
