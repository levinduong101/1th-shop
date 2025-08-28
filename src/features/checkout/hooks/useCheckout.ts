import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CheckoutPayload, submitCheckout } from '../service/submit.checkout';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/src/store/productStore';
import { CheckoutFormValues } from '../lib/schema';
import { uploadImage } from '../service/upload.image';
import { useAuthStore } from '@/src/store/authStore';

const SKU = process.env.NEXT_PUBLIC_PRODUCT_SKU;

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const router = useRouter();
  const { formStore: productStore } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return {
    isLoading,

    async submit(data: CheckoutFormValues, pinCode: string) {
      if (loadingRef.current) return;
      if (!productStore?.file) {
        toast.error('Please upload a design image before submitting your order.');
        return;
      }
      if (!SKU) {
        toast.error('Product SKU is not defined. Please contact support.');
        return;
      }

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const upload: any = await uploadImage(productStore.file);

        if (!upload?.url) {
          throw new Error('Image upload failed. Please try again.');
        }

        const payload: CheckoutPayload = {
          product_sku: SKU,
          restaurant_name: data.restaurantName,
          request_size: productStore?.size || '',
          color: productStore?.color || '',
          logo: upload?.url || '',
          employee_id: pinCode,
          email: data.email,
          phone: data.phone,
          street: data.building + (data.street ? `, ${data.street}` : ''),
          city: data.district || '',
          postcode: data.postcode?.toString() || '',
        };
        const res = await submitCheckout(payload);
        if (res?.errors) {
          throw new Error(
            res.errors[0]?.extensions?.debugMessage ||
              res.errors[0]?.message ||
              'An error occurred while submitting your order.',
          );
        }

        if (!user?.name || !user?.email) {
          setUser({
            email: data.email,
            name: data.restaurantName,
            video: null,
          });
        }

        toast.success('Your order has been placed successfully!');
        setTimeout(() => {
          router.push('/confirm');
        }, 500);
      } catch (error: any) {
        toast.error(error?.message || 'An unexpected error occurred. Please try again.');
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
