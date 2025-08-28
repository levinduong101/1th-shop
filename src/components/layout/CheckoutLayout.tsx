'use client';
import { useProductStore } from '@/src/store/productStore';
import { redirect } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const productStore = useProductStore((state) => state.formStore);

  if (!productStore) {
    toast.error('Please design your product first!');
    redirect('/design-product');
  }

  return children;
}
