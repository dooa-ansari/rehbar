import { create } from 'zustand';

interface PanelState {
  activePanelId: string | null;
  setActivePanel: (panelId: string | null) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  activePanelId: null,
  setActivePanel: (panelId) => set({ activePanelId: panelId }),
})); 