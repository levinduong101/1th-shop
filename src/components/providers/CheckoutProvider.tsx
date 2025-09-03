'use client';
import { useProductStore } from '@/src/store/productStore';
import { redirect, useParams } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

export default function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const productStore = useProductStore((state) => state.formStore);
  const { store } = useParams();

  if (!productStore) {
    toast.error('Please design your product first!');
    redirect(`/${store}/personalize-product`);
  }

  return children;
}
