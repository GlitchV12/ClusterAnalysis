import { create } from 'zustand';
import type { Dataset } from '../types/dataset';
import { ProfilingService, type DatasetQuality } from '../features/profiling/services/profiling.service';

interface DatasetState {
  dataset: Dataset | null;
  quality: DatasetQuality | null;
  isLoading: boolean;
  error: string | null;
  setDataset: (dataset: Dataset) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetDataset: () => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  dataset: null,
  quality: null,
  isLoading: false,
  error: null,
  setDataset: (dataset) => {
    // Automatically profile the dataset when loaded
    const { columns, quality } = ProfilingService.profileDataset(dataset);
    const profiledDataset = { ...dataset, columns };
    set({ dataset: profiledDataset, quality, error: null, isLoading: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  resetDataset: () => set({ dataset: null, quality: null, error: null, isLoading: false }),
}));
