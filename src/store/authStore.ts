import { create } from 'zustand';
import { User } from '../hooks/useAuth';

interface AuthState {
  pinCode: string | null;
  setPinCode: (pinCode: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Pincode
  pinCode: null,
  setPinCode: (pinCode: string | null) => set({ pinCode }),

  // User
  user: null,
  setUser: (user: User | null) => set({ user }),
}));
