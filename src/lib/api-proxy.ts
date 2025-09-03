import axios, { CreateAxiosDefaults } from 'axios';
import { toast } from 'react-toastify';

const baseConfig: CreateAxiosDefaults<any> = {
  // baseURL: '/api/store/{store}',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const apiProxy = axios.create(baseConfig);

export const configApiProxy = (config: CreateAxiosDefaults<any>) => {
  if (config.baseURL) apiProxy.defaults.baseURL = config.baseURL;
  if (config.timeout) apiProxy.defaults.timeout = config.timeout;
  if (config.headers) {
    Object.assign(apiProxy.defaults.headers, config.headers);
  }
};

apiProxy.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (typeof window !== 'undefined') {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
    return Promise.reject(error);
  },
);

export default apiProxy;
