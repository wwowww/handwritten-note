import { create } from 'zustand';

interface Point {
  x: number;
  y: number;
}

interface DrawingState {
  isDrawing: boolean;
  drawings: Record<number, Point[][]>;
  currentPage: number;
  refreshVersion: number;
  triggerRefresh: () => void;
  startDraw: (x: number, y: number) => void;
  draw: (x: number, y: number) => void;
  stopDraw: () => void;
  setPage: (page: number) => void;
  resetAll: () => void;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  isDrawing: false,
  drawings: {},
  currentPage: 1,
  refreshVersion: 0,
  triggerRefresh: () => {
    set((state) => ({ refreshVersion: state.refreshVersion + 1 }));
  },
  setPage: (page) => {
    set({ currentPage: page });
  },
  startDraw: (x, y) => {
    const { drawings, currentPage } = get();
    const pageDrawings = drawings[currentPage] || [];
    const newLine: Point[] = [{ x, y }];

    set({
      isDrawing: true,
      drawings: {
        ...drawings,
        [currentPage]: [...pageDrawings, newLine],
      },
    });
  },
  draw: (x, y) => {
    const { isDrawing, drawings, currentPage } = get();
    if (!isDrawing) return;

    const pageDrawings = drawings[currentPage] || [];
    const updatedLines = [...pageDrawings];

    if (updatedLines.length === 0) return;

    const currentLine = [...updatedLines[updatedLines.length - 1], { x, y }];
    updatedLines[updatedLines.length - 1] = currentLine;

    set({
      drawings: {
        ...drawings,
        [currentPage]: updatedLines,
      },
    });
  },
  stopDraw: () => {
    set({ isDrawing: false });
  },
  resetAll: () => {
    set({ drawings: {}, isDrawing: false });
  },
}));
