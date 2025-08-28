'use client';

import { useAuthStore } from '@/src/store/authStore';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pinCode = useAuthStore((state) => state.pinCode);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chờ hydration hoàn tất và chỉ chạy trên client
  if (!isClient || !hasHydrated) {
    return <div>Loading...</div>; // Hoặc loading spinner
  }

  // Sau khi hydrate, check pinCode
  if (!pinCode) {
    redirect('/landing');
  }

  return <>{children}</>;
}