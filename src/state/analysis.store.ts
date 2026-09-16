import { create } from 'zustand';
import type { KMeansResult } from '../features/clustering/services/kmeans.service';

interface ElbowPoint {
  k: number;
  wcss: number;
  silhouetteScore: number;
}

interface AnalysisState {
  isAnalyzing: boolean;
  elbowData: ElbowPoint[] | null;
  selectedK: number;
  clusteringResult: KMeansResult | null;
  
  setAnalyzing: (analyzing: boolean) => void;
  setElbowData: (data: ElbowPoint[]) => void;
  setSelectedK: (k: number) => void;
  setClusteringResult: (result: KMeansResult) => void;
  resetAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  isAnalyzing: false,
  elbowData: null,
  selectedK: 3, // Default K
  clusteringResult: null,

  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setElbowData: (data) => set({ elbowData: data }),
  setSelectedK: (k) => set({ selectedK: k }),
  setClusteringResult: (result) => set({ clusteringResult: result, isAnalyzing: false }),
  resetAnalysis: () => set({
    isAnalyzing: false,
    elbowData: null,
    selectedK: 3,
    clusteringResult: null
  }),
}));
