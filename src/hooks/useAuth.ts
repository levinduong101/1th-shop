import { useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import apiProxy from '../lib/api-proxy';
import { toast } from 'react-toastify';

export type User = {
  name: string;
  email: string;
  isUploaded: '1' | null;
};

export type AuthResponse = {
  getEmployeeByCcepNummer: {
    token: string;
    user: User | null;
  };
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const { pinCode: pinCodeStore, setPinCode, setUser } = useAuthStore();

  return {
    isLoading,

    async auth(pinCode?: string) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);

      try {
        if (!pinCode && !pinCodeStore) {
          throw new Error('Pin code is required for authentication.');
        }

        const res = await apiProxy.post<AuthResponse, any>(
          '/auth',
          JSON.stringify({ pinCode: pinCode || pinCodeStore }),
        );
        if (res?.errors) {
          throw new Error('Invalid pin code. Please try again.');
        }

        const data = res?.data;
        const { user } = data?.getEmployeeByCcepNummer;

        if (pinCode) setPinCode(pinCode);
        if (user) setUser({ isUploaded: 0, ...user });
      } catch (error: any) {
        toast.error(error?.message || 'Authentication failed. Please try again.');
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
