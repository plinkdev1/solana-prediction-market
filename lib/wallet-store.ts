import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  connect: (publicKey: string) => void;
  disconnect: () => void;
  updateBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      connected: false,
      publicKey: null,
      balance: 0,
      connect: (publicKey: string) => set({ connected: true, publicKey }),
      disconnect: () => set({ connected: false, publicKey: null, balance: 0 }),
      updateBalance: (balance: number) => set({ balance }),
    }),
    {
      name: 'dxmarkets-wallet',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : ({
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      } as any)),
    }
  )
);
