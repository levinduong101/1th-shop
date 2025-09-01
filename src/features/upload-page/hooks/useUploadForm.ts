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
  const user = useAuthStore((state) => state.user);
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
      callbackSuccess?: () => void;
    }) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);
      try {
        const upload = await submitUploadForm({ data, pinCode });

        setUser({
          ...user,
          name: user?.name || data.name,
          email: user?.email || data.email,
          video_id: upload?.video_id || null,
        });

        toast.success('Your video has been submitted successfully!');
        callbackSuccess?.();
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
