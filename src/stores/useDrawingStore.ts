import { create } from 'zustand';

interface Point {
  x: number;
  y: number;
}

interface DrawingState {
  isDrawing: boolean;
  points: Point[];
  startDraw: (x: number, y: number) => void;
  draw: (x: number, y: number) => void;
  stopDraw: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  isDrawing: false,
  points: [],
  startDraw: (x, y) =>
    set((state) => ({
      isDrawing: true,
      points: [...state.points, { x, y }],
    })),
  draw: (x, y) =>
    set((state) =>
      state.isDrawing
        ? { points: [...state.points, { x, y }] }
        : {}
    ),
  stopDraw: () => set({ isDrawing: false }),
}));
