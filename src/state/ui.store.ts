import { create } from 'zustand';

interface UIState {
  activeStep: string;
  isSidebarOpen: boolean;
  setActiveStep: (step: string) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeStep: 'upload',
  isSidebarOpen: true,
  setActiveStep: (step) => set({ activeStep: step }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
