import { create } from 'zustand';

interface ProductState {
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}

export const useSelectedColor = create<ProductState>((set) => ({
  selectedColor: null,
  setSelectedColor: (color) => set({ selectedColor: color }),
}));
