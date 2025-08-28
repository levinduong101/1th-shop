import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../hooks/useAuth';

interface AuthState {
  pinCode: string | null;
  pinCodeExpiry: number | null; // timestamp when pinCode expires
  setPinCode: (pinCode: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  // Add flag to track hydration
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  // Helper to check if pinCode is still valid
  isValidPinCode: () => boolean;
  // Clear everything on logout
  clearAll: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Pincode
      pinCode: null,
      pinCodeExpiry: null,
      setPinCode: (pinCode) => {
        if (pinCode) {
          // Set expire time 24h from now
          const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
          set({ pinCode, pinCodeExpiry: expiry });
        } else {
          // Clear pinCode and expiry
          get().clearAll();
        }
      },

      // User
      user: null,
      setUser: (user) => set({ user }),

      // Hydration tracking
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),

      // Check if pinCode is still valid
      isValidPinCode: () => {
        const { pinCode, pinCodeExpiry } = get();
        if (!pinCode || !pinCodeExpiry) return false;

        const isExpired = Date.now() > pinCodeExpiry;
        if (isExpired) {
          get().clearAll();
          return false;
        }
        return true;
      },

      // Clear all data on logout
      clearAll: () => {
        set({
          pinCode: null,
          pinCodeExpiry: null,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        pinCode: state.pinCode,
        pinCodeExpiry: state.pinCodeExpiry,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Check and remove expired pinCode immediately on hydrate
        if (state && state.pinCode && state.pinCodeExpiry) {
          const isExpired = Date.now() > state.pinCodeExpiry;
          if (isExpired) {
            state.clearAll();
          }
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
