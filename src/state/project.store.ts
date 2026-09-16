import { create } from 'zustand';

interface ProjectState {
  projectId: string | null;
  projectName: string;
  setProject: (id: string, name: string) => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectId: null,
  projectName: 'New Analysis',
  setProject: (id, name) => set({ projectId: id, projectName: name }),
  resetProject: () => set({ projectId: null, projectName: 'New Analysis' }),
}));
