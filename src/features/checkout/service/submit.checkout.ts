import apiProxy from '@/src/lib/api-proxy';

export type CheckoutPayload = {
  product_id: string;
  request_size: string;
  color: string;
  logo: string;
  employee_id: string;
  restaurant_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
};

export const submitCheckout = async (data: CheckoutPayload) => {
  try {
    const res = apiProxy.post<any, any>('/checkout', JSON.stringify(data));
    return res;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Submit error:', error);
    throw error;
  }
};
