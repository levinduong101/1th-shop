import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base-dev.prowerb.digital',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (typeof window !== 'undefined') {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
