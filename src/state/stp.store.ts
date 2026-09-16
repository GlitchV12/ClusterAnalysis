import { create } from 'zustand';

interface STPState {
  segmentNames: Record<number, string>;
  targetClusterId: number | null;
  positioningStatement: string;

  setSegmentName: (clusterId: number, name: string) => void;
  setTargetClusterId: (clusterId: number | null) => void;
  setPositioningStatement: (statement: string) => void;
  resetSTP: () => void;
}

export const useSTPStore = create<STPState>((set) => ({
  segmentNames: {},
  targetClusterId: null,
  positioningStatement: '',

  setSegmentName: (clusterId, name) => set((state) => ({
    segmentNames: { ...state.segmentNames, [clusterId]: name }
  })),

  setTargetClusterId: (clusterId) => set({ targetClusterId: clusterId }),

  setPositioningStatement: (statement) => set({ positioningStatement: statement }),

  resetSTP: () => set({
    segmentNames: {},
    targetClusterId: null,
    positioningStatement: ''
  })
}));
