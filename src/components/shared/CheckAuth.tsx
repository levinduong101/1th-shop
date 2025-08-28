'use client';
import { useAuth } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';
import { useEffect, useRef } from 'react';

export default function CheckAuth() {
  const pinCode = useAuthStore((state) => state.pinCode);
  const { auth } = useAuth();
  const isChecked = useRef(false);

  useEffect(() => {
    if (pinCode && !isChecked.current) {
      isChecked.current = true;
      auth(pinCode);
    }
  }, [pinCode, auth]);

  return null;
}
