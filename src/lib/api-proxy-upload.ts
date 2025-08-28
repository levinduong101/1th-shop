import axios from 'axios';
import { toast } from 'react-toastify';

const apiProxyUpload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_UPLOAD_URL || 'https://proxy-1th-shop.onrender.com',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiProxyUpload.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (typeof window !== 'undefined') {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
    return Promise.reject(error);
  },
);

export default apiProxyUpload;
