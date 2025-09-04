import apiProxyUpload from '@/src/lib/api-proxy-upload';
import { VideoFormPayload } from '../hooks/useUploadForm';

export const submitUploadForm = async ({
  data,
  pinCode,
}: {
  data: VideoFormPayload;
  pinCode: string;
}) => {
  try {
    const formData = new FormData();

    // Append file
    if (data.file) {
      formData.append('file', data.file);
    }

    // Append other form fields
    formData.append('employees_id', pinCode);

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'file' && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = await apiProxyUpload.post('/rest/V1/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res as any;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Upload error:', error);
    throw error;
  }
};
