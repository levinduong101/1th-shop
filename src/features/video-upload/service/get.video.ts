import apiProxy from '@/src/lib/api-proxy';

export const getVideoUrl = async ({
  customer_id,
  pin_code,
  video_id,
}: {
  video_id: string;
  pin_code: string;
  customer_id: string;
}) => {
  try {
    const res = await apiProxy.get<any>('/video/get', {
      params: {
        video_id,
        pin_code,
        customer_id,
      },
    });
    return res?.data;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Get video error:', error);
    throw error;
  }
};
