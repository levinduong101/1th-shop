import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../hooks/useAuth';

interface AuthState {
  pinCode: string | null;
  setPinCode: (pinCode: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  // Tracking hydrated state
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Pincode
      pinCode: null,
      setPinCode: (pinCode) => set({ pinCode }),

      // User
      user: null,
      setUser: (user) => set({ user }),

      // Hydration tracking
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        pinCode: state.pinCode,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
