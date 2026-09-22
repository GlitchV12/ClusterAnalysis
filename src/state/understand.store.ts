import { create } from 'zustand';

interface UnderstandState {
  xFeature: string;
  yFeature: string;
  projectionMode: 'raw' | 'pca';
  swapPCA: boolean;
  rotation: number;
  selectedRadarFeatures: string[];
  
  setXFeature: (feature: string) => void;
  setYFeature: (feature: string) => void;
  setProjectionMode: (mode: 'raw' | 'pca') => void;
  setSwapPCA: (swap: boolean) => void;
  setRotation: (rotation: number | ((prev: number) => number)) => void;
  setSelectedRadarFeatures: (features: string[] | ((prev: string[]) => string[])) => void;
  
  resetUnderstand: () => void;
}

const initialState = {
  xFeature: '',
  yFeature: '',
  projectionMode: 'pca' as const,
  swapPCA: false,
  rotation: 0,
  selectedRadarFeatures: [],
};

export const useUnderstandStore = create<UnderstandState>((set) => ({
  ...initialState,
  
  setXFeature: (feature) => set({ xFeature: feature }),
  setYFeature: (feature) => set({ yFeature: feature }),
  setProjectionMode: (mode) => set({ projectionMode: mode }),
  setSwapPCA: (swap) => set({ swapPCA: swap }),
  setRotation: (rotation) => set((state) => ({ 
    rotation: typeof rotation === 'function' ? rotation(state.rotation) : rotation 
  })),
  setSelectedRadarFeatures: (features) => set((state) => ({
    selectedRadarFeatures: typeof features === 'function' ? features(state.selectedRadarFeatures) : features
  })),
  
  resetUnderstand: () => set(initialState),
}));
