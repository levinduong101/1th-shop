import { toast } from 'react-toastify';
import { FormValues } from '../lib/schema';
import { submitUploadForm } from '../service/submit.form';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';

export const useUploadForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return {
    isLoading,

    async submit({
      callbackSuccess,
      data,
      pinCode,
    }: {
      data: FormValues;
      pinCode: string;
      callbackSuccess: () => void;
    }) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);
      try {
        await submitUploadForm({ data, pinCode });

        setUser({
          name: data.name,
          email: data.email,
          video: '1',
        });

        toast.success('Your video has been submitted successfully!');
        callbackSuccess?.();
        setTimeout(() => {
          router.push('/landing');
        }, 1000);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
