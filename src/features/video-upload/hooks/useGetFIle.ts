import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getVideoUrl } from '../service/get.video';
import { useAuthStore } from '@/src/store/authStore';

type VideoResponse = {
  submission_id: string;
  customer_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  video_filename: string;
  s3_key: string | null;
  video_url: string;
  status: string;
  created_at: string; // ISO datetime
  updated_at: string | null;
  employees_id: string;
  count_edit: number;
  limit_configuration: number;
};

export const useGetFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const user = useAuthStore((state) => state.user);
  const pinCode = useAuthStore((state) => state.pinCode);

  return {
    isLoading,

    async getUploaded(videoId: string) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);

      try {
        if (!user?.customer_id || !pinCode) {
          throw new Error('User not authenticated');
        }

        const res: VideoResponse[] = await getVideoUrl({
          customer_id: user.customer_id?.toString(),
          pin_code: pinCode,
          video_id: videoId,
        });

        return res?.[0] || null;
      } catch (error: any) {
        toast.error(error?.message || 'Error fetching video preview image');
        return null;
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
