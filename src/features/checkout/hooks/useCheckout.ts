import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CheckoutPayload, submitCheckout } from '../service/submit.checkout';
import { useParams, useRouter } from 'next/navigation';
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
  const { store } = useParams();

  return {
    isLoading,

    async submit(
      {
        data,
        pinCode,
        status,
      }: {
        data: CheckoutFormValues;
        pinCode: string;
        status: 1 | 5;
      },
      callbackSuccess?: () => void,
    ) {
      if (loadingRef.current) return;
      if (!productStore?.file) {
        toast.error('Please upload a design image before submitting your order.');
        return;
      }
      if (!SKU) {
        toast.error('Product SKU is not defined. Please contact support.');
        return;
      }
      if (!user?.customer_id) {
        toast.error('User is not authenticated. Please log in and try again.');
        return;
      }
      if (!productStore?.product_id) {
        toast.error('Product ID is missing. Please select a product and try again.');
        return;
      }

      loadingRef.current = true;
      setIsLoading(true);

      try {
        let uploadUrl = typeof productStore?.file === 'string' ? productStore?.file : '';
        if (typeof productStore?.file !== 'string') {
          const upload: any = await uploadImage(productStore.file);

          if (!upload?.url) {
            throw new Error('Image upload failed. Please try again.');
          }

          uploadUrl = upload.url;
        }

        const payload: CheckoutPayload = {
          product_sku: SKU,
          restaurant_name: data.restaurantName,
          request_size: productStore?.size?.key || '',
          color: productStore?.color?.key || '',
          logo: uploadUrl || '',
          employee_id: pinCode,
          email: data.email,
          phone: data.phone,
          street: data.street,
          street2: data.street2,
          city: data.district || '',
          postcode: data.postcode?.toString() || '',
          personalizehoodieorder_id: status === 5 ? user?.personalize_draff || 0 : 0,
          customer_id: user?.customer_id,
          product_id: productStore?.product_id,
          status: status,
        };
        const res = await submitCheckout(payload);
        if (res?.errors) {
          throw new Error(
            res.errors[0]?.extensions?.debugMessage ||
              res.errors[0]?.message ||
              'An error occurred while submitting your order.',
          );
        }

        if (callbackSuccess) callbackSuccess();

        const dataRes = res?.data?.createPersonalizeHoodieOrder;

        if (dataRes) {
          setUser({ ...user!, personalize_draff: dataRes.personalizehoodieorder_id });
        }

        if (status === 1) {
          toast.success('Your order has been placed successfully!');
          setTimeout(() => {
            router.push(`/${store}/confirm`);
          }, 500);
        } else if (status === 5) {
          toast.success('Your draft has been saved successfully!');
        }
      } catch (error: any) {
        toast.error(error?.message || 'An unexpected error occurred. Please try again.');
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
  };
};
