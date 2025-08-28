'use client';

import { useAuthStore } from '@/src/store/authStore';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pinCode = useAuthStore((state) => state.pinCode);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  if (!hydrated) {
    return null;
  }

  if (!pinCode) {
    // eslint-disable-next-line no-console
    console.log('No pin code found, redirecting to /landing', pinCode);
    redirect('/landing');
  }

  return <>{children}</>;
}
