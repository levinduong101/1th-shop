'use client';
import { useEffect } from 'react';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useProductStore } from '@/src/store/productStore';

export default function ClearForm() {
  const clearForm = useCheckoutStore((state) => state.clearForm);
  const setFormProduct = useProductStore((state) => state.setFormStore);

  useEffect(() => {
    clearForm?.();
    setFormProduct?.(null);
  }, [clearForm, setFormProduct]);

  return null;
}
