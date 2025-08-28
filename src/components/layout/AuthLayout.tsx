'use client';

import { useAuthStore } from '@/src/store/authStore';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pinCode = useAuthStore((state) => state.pinCode);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Hydrating...');
    useAuthStore.persist.onFinishHydration(() => {
      // eslint-disable-next-line no-console
      console.log('Hydrated', useAuthStore.getState().pinCode);
      setHydrated(true);
    });
  }, []);

  if (!hydrated) {
    // eslint-disable-next-line no-console
    console.log('Not hydrated yet', hydrated);
    return null;
  }

  if (!pinCode) {
    // eslint-disable-next-line no-console
    console.log('No pin code found, redirecting to /landing', pinCode);
    redirect('/landing');
  }

  return <>{children}</>;
}
