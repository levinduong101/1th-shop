import { create } from 'zustand';
import { CheckoutFormValues } from '../features/checkout/lib/schema';

interface CheckoutState {
  formStore: CheckoutFormValues | null;
  setFormStore: (data: CheckoutFormValues | null) => void;
  clearForm: () => void;
}

const initValue = {
  email: '',
  phone: '',
  restaurantName: '',
  street: '',
  building: '',
  district: '',
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  formStore: null,
  setFormStore: (data: CheckoutFormValues | null) => set({ formStore: data }),
  clearForm: () => set({ formStore: { ...initValue } }),
}));
