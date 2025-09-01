import { create } from 'zustand';
import { CheckoutFormValues } from '../features/checkout/lib/schema';

interface CheckoutState {
  formStore: CheckoutFormValues | null;
  setFormStore: (data: CheckoutFormValues | null) => void;
  clearForm: () => void;
}

const initValue: CheckoutFormValues = {
  email: '',
  phone: '',
  restaurantName: '',
  street: '',
  street2: '',
  district: '',
  postcode: '',
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  formStore: null,
  setFormStore: (data: CheckoutFormValues | null) => set({ formStore: data }),
  clearForm: () => set({ formStore: { ...initValue } }),
}));
