import { create } from 'zustand';

type AppState = {
  currentPage: 'dashboard' | 'bots' | 'settings';
  setPage: (p: AppState['currentPage']) => void;
};

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'dashboard',
  setPage: (p) => set({ currentPage: p }),
}));
