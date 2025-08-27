import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base.prowerb.digital';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 300000,
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
