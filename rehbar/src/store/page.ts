// stores/pageStore.ts
import { create } from 'zustand';


interface PageState {
  
  fromPage: number;
  pageCount: number;
  lastFetchPage: number;
  totalPages: number;
  setPageCount: (count: number) => void;
  setFromPage: (page: number) => void;
  setTotalPages: (count: number) => void;
  setLastFetchPage: (page: number) => void;
}

export const usePageStore = create<PageState>((set) => ({

  fromPage: 1,
  pageCount: 5,
  lastFetchPage: 1,
  totalPages: 0,

  setPageCount: (count) => set({ pageCount: count }),
  setFromPage: (page) => set({ fromPage: page }),
  setTotalPages: (count) => set({ totalPages: count }),
  setLastFetchPage: (page) => set({ lastFetchPage: page }),
}));
