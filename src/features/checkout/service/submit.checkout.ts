import apiProxy from '@/src/lib/api-proxy';

export type CheckoutPayload = {
  product_sku: string;
  request_size: string;
  color: string;
  logo: string;
  employee_id: string;
  restaurant_name: string;
  email: string;
  phone: string;
  street: string;
  street2?: string;
  city: string;
  postcode: string;
  personalizehoodieorder_id: number; // 0 -> if order is NEW, existed ID if order is draff
  product_id: number;
  status: 1 | 5; // 1 -> Pending, 5 -> Draff
  customer_id: number;
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
