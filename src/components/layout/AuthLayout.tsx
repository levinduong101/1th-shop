'use client';

import { useAuthStore } from '@/src/store/authStore';
import { redirect } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pinCode = useAuthStore((state) => state.pinCode);
  if (!pinCode) {
    console.log('No pin code found, redirecting to /landing', pinCode);
    redirect('/landing');
  }

  return <>{children}</>;
}
