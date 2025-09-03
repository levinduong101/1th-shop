'use client';

import { useAuthStore } from '@/src/store/authStore';
import { LoaderCircle } from 'lucide-react';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const isValidPinCode = useAuthStore((state) => state.isValidPinCode);
  const pinCode = useAuthStore((state) => state.pinCode);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isClient, setIsClient] = useState(false);
  const { store } = useParams();

  useEffect(() => {
    setIsClient(true);
  }, [pinCode]);

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
    redirect(`/${store}/landing`);
  }

  return <>{children}</>;
}
