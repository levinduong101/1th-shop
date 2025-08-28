import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CheckoutPayload, submitCheckout } from '../service/submit.checkout';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useProductStore } from '@/src/store/productStore';
import { CheckoutFormValues } from '../lib/schema';
import { uploadImage } from '../service/upload.image';
import { useAuthStore } from '@/src/store/authStore';

const SKU = process.env.NEXT_PUBLIC_PRODUCT_SKU;

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const router = useRouter();
  const clearForm = useCheckoutStore((state) => state.clearForm);
  const { formStore: productStore, setFormStore: setFormProduct } = useProductStore();
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
        const upload = await uploadImage(productStore.file);

        const payload: CheckoutPayload = {
          product_id: SKU,
          restaurant_name: data.restaurantName,
          request_size: productStore?.size || '',
          color: productStore?.color || '',
          logo: upload?.[0] || '',
          employee_id: pinCode,
          email: data.email,
          phone: data.phone,
          street: data.street + (data.building ? `, ${data.building}` : ''),
          city: data.district || '',
        };
        const res = await submitCheckout(payload);
        if (res?.errors) {
          throw new Error(
            res.errors[0]?.message || 'An error occurred while submitting your order.',
          );
        }

        if (!user) {
          setUser({
            email: data.email,
            name: data.restaurantName,
          });
        }

        toast.success('Your order has been placed successfully!');
        clearForm();
        setFormProduct(null);
        setTimeout(() => {
          router.push('/confirm');
        }, 1000);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
