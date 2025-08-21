import { create } from 'zustand';
import { ProductFormValues } from '../features/product/lib/schema';

interface ProductState {
  formStore: ProductFormValues | null;
  setFormStore: (data: ProductFormValues | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  formStore: null,
  setFormStore: (data: ProductFormValues | null) => set({ formStore: data }),
}));
