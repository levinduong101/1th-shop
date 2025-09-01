import { create } from 'zustand';
import { ProductFormValues } from '../features/product/lib/schema';

type FormStore = ProductFormValues & { product_id: number };

interface ProductState {
  formStore: FormStore | null;
  setFormStore: (data: FormStore | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  formStore: null,
  setFormStore: (data: FormStore | null) => set({ formStore: data }),
}));
