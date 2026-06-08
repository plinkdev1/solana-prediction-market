import { create } from 'zustand';

type ModalType = 'age-gate' | 'cookie-banner' | 'wallet-connect' | null;

interface UIState {
  showAgeGate: boolean;
  showCookieBanner: boolean;
  sidebarOpen: boolean;
  activeModal: ModalType;
  setShowAgeGate: (show: boolean) => void;
  setShowCookieBanner: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveModal: (modal: ModalType) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showAgeGate: false,
  showCookieBanner: false,
  sidebarOpen: false,
  activeModal: null,
  setShowAgeGate: (show) => set({ showAgeGate: show }),
  setShowCookieBanner: (show) => set({ showCookieBanner: show }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
