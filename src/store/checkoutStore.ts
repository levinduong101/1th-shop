import { create } from 'zustand';
import { CheckoutFormValues } from '../features/checkout/lib/schema';

interface CheckoutState {
  formStore: CheckoutFormValues | null;
  setFormStore: (data: CheckoutFormValues | null) => void;
  setPinCode: (pinCode: string) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  formStore: null,
  setFormStore: (data: CheckoutFormValues | null) => set({ formStore: data }),
  setPinCode: (pinCode: string) =>
    set((state) => ({
      formStore: state.formStore
        ? { ...state.formStore, pinCode }
        : {
            email: '',
            phone: '',
            restaurantName: '',
            street: '',
            building: '',
            district: '',
            pinCode,
          },
    })),
}));
