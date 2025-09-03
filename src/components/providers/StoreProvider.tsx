'use client';

import { configApiProxy } from '@/src/lib/api-proxy';
import { useAuthStore } from '@/src/store/authStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useProductStore } from '@/src/store/productStore';
import { useSelectedColor } from '@/src/store/selectedColorStore';
import { useEffect, useRef } from 'react';
import CheckAuth from '../shared/CheckAuth';

type Props = {
  children: React.ReactNode;
  store: string;
};

export default function StoreProvider({ children, store }: Props) {
  const clearAuth = useAuthStore((state) => state.clearAll);
  const clearCheckout = useCheckoutStore((state) => state.clearForm);
  const setProductStore = useProductStore((state) => state.setFormStore);
  const setSelectedColor = useSelectedColor((state) => state.setSelectedColor);
  const storeInAuth = useAuthStore((state) => state.store);
  const setStoreInAuth = useAuthStore((state) => state.setStore);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isNewStore = useRef(true);

  /** Check if store change */
  useEffect(() => {
    if (store && hasHydrated) {
      const isNew = Boolean(storeInAuth && storeInAuth !== store);
      if (isNew) {
        clearAuth();
        clearCheckout();
        setProductStore(null);
        setSelectedColor(null);
      }

      configApiProxy({ baseURL: `/api/store/${store}` });
      setStoreInAuth(store);
      isNewStore.current = isNew;
    }
  }, [
    store,
    storeInAuth,
    hasHydrated,
    clearAuth,
    clearCheckout,
    setProductStore,
    setSelectedColor,
    setStoreInAuth,
  ]);

  if (!store || !hasHydrated) return null;

  return (
    <>
      {!isNewStore.current && <CheckAuth />}
      {children}
    </>
  );
}
