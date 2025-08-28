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

    async submit(data: FormValues, pinCode: string) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);
      try {
        await submitUploadForm({ data, pinCode });

        if (!user) {
          setUser({ name: data.name, email: data.email });
        }

        toast.success('Your video has been submitted successfully!');
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
