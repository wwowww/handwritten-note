import { create } from 'zustand';

interface PdfState {
  pageNumber: number;
  totalPages: number;
  setPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const usePdfStore = create<PdfState>((set, get) => ({
  pageNumber: 1,
  totalPages: 1,
  setPage: (page) => set({ pageNumber: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  nextPage: () => {
    const { pageNumber, totalPages } = get();
    if (pageNumber < totalPages) set({ pageNumber: pageNumber + 1 });
  },
  prevPage: () => {
    const { pageNumber } = get();
    if (pageNumber > 1) set({ pageNumber: pageNumber - 1 });
  },
}));
