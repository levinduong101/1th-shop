import { useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import apiProxy from '../lib/api-proxy';
import { toast } from 'react-toastify';

export type Address = {
  street?: string;
  building?: string;
  city?: string;
  postcode?: string;
};

export type User = {
  customer_id?: number;
  ccepemployee_id?: number;
  ccep_nummer?: string;
  name?: string;
  email: string | null;
  address?: Address | null;
  order_ids?: string;
  video_id?: string;
  personalize_items?: string;
  personalize_draff?: number;
};

export type AuthResponse = {
  getEmployeeByCcepNummer: {
    user: User | null;
  };
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const { pinCode: pinCodeStore, setPinCode, setUser, clearAll, user } = useAuthStore();

  return {
    isLoading,

    async auth(pinCode?: string, email?: string) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);

      try {
        if (!pinCode && !pinCodeStore) {
          throw new Error('Pin code is required for authentication.');
        }
        if (!email && !user?.email) {
          throw new Error('Email is required for authentication.');
        }

        const res = await apiProxy.post<AuthResponse, any>(
          '/auth',
          JSON.stringify({ pinCode: pinCode || pinCodeStore, email: email || user?.email }),
        );
        if (res?.errors) {
          throw new Error(
            res?.errors?.[0]?.extensions?.debugMessage ||
              res?.errors?.[0]?.message ||
              'Invalid pin code. Please try again.',
          );
        }

        const data = res?.data;
        const { user: userResponse } = data?.getEmployeeByCcepNummer;

        if (pinCode) setPinCode(pinCode);
        if (userResponse) setUser({ video_id: null, ...userResponse });
      } catch (error: any) {
        toast.error(error?.message || 'Authentication failed. Please try again.');
        clearAll();
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
