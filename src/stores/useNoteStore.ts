import { create } from 'zustand';

interface NoteStore {
  file: File | null;
  setFile: (file: File | null) => void;
  clearFile: () => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  file: null,
  setFile: (file) => set({ file }),
  clearFile: () => set({ file: null }),
}));