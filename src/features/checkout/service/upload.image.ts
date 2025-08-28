import apiProxyUpload from '@/src/lib/api-proxy-upload';

export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiProxyUpload.post('/rest/V1/personalizehoodie/uploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Upload error:', error);
    throw error;
  }
};
