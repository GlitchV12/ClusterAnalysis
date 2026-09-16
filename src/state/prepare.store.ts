import { create } from 'zustand';

export type ImputationStrategy = 'drop' | 'mean' | 'zero';
export type ScalingStrategy = 'standard' | 'minmax' | 'none';
export type OutlierStrategy = 'none' | 'zscore';

interface PrepareState {
  selectedFeatures: string[]; // array of column IDs
  imputationStrategy: ImputationStrategy;
  scalingStrategy: ScalingStrategy;
  outlierStrategy: OutlierStrategy;
  usePCA: boolean;
  
  toggleFeature: (colId: string) => void;
  setAllFeatures: (colIds: string[]) => void;
  setImputationStrategy: (strategy: ImputationStrategy) => void;
  setScalingStrategy: (strategy: ScalingStrategy) => void;
  setOutlierStrategy: (strategy: OutlierStrategy) => void;
  setUsePCA: (use: boolean) => void;
  resetPrepare: () => void;
}

export const usePrepareStore = create<PrepareState>((set) => ({
  selectedFeatures: [],
  imputationStrategy: 'drop',
  scalingStrategy: 'standard', // Default for K-means usually
  outlierStrategy: 'none',
  usePCA: false,

  toggleFeature: (colId) => set((state) => ({
    selectedFeatures: state.selectedFeatures.includes(colId)
      ? state.selectedFeatures.filter(id => id !== colId)
      : [...state.selectedFeatures, colId]
  })),
  
  setAllFeatures: (colIds) => set({ selectedFeatures: colIds }),
  
  setImputationStrategy: (strategy) => set({ imputationStrategy: strategy }),
  
  setScalingStrategy: (strategy) => set({ scalingStrategy: strategy }),

  setOutlierStrategy: (strategy) => set({ outlierStrategy: strategy }),
  
  setUsePCA: (use) => set({ usePCA: use }),
  
  resetPrepare: () => set({
    selectedFeatures: [],
    imputationStrategy: 'drop',
    scalingStrategy: 'standard',
    outlierStrategy: 'none',
    usePCA: false
  })
}));
