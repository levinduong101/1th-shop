import { toast } from 'react-toastify';
import { FormValues } from '../lib/schema';
import { submitUploadForm } from '../service/submit.form';
import { useRef, useState } from 'react';

export const useUploadForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);

  return {
    isLoading,

    async submit(data: FormValues, pinCode: string) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);
      try {
        await submitUploadForm({ data, pinCode });
        toast.success('Your video has been submitted successfully!');
      } catch (error: any) {
        toast.error(error?.message || 'Something went wrong, please try again later.');
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
