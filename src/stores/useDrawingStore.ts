import { create } from 'zustand';
import { Pen, PenType, penSettings } from '@/utils/penTypes';
import { nanoid } from 'nanoid';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  page: number;
  points: Point[];
  color: string;
  size: number;
  opacity: number;
  tool: string;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
}

interface DrawingState {
  isDrawing: boolean;
  drawings: Record<number, Stroke[]>;
  currentPage: number;
  currentPen: Pen;
  refreshVersion: number;
  triggerRefresh: () => void;
  setPage: (page: number) => void;
  setPen: (pen: Pen) => void;
  startDraw: (x: number, y: number) => void;
  draw: (x: number, y: number) => void;
  stopDraw: () => void;
  resetAll: () => void;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  isDrawing: false,
  drawings: {},
  currentPage: 1,
  currentPen: penSettings[PenType.BALLPOINT],
  refreshVersion: 0,
  triggerRefresh: () => {
    set((state) => ({ refreshVersion: state.refreshVersion + 1 }));
  },
  setPage: (page) => {
    set({ currentPage: page });
  },
  setPen: (pen) => {
    set({ currentPen: pen });
  },
  startDraw: (x, y) => {
    const { drawings, currentPage, currentPen } = get();
    const pageDrawings = drawings[currentPage] || [];

    const newStroke: Stroke = {
      id: nanoid(),
      page: currentPage,
      points: [{ x, y }],
      color: currentPen.color,
      size: currentPen.size,
      opacity: currentPen.opacity,
      tool: currentPen.type,
      lineCap: currentPen.lineCap,
      lineJoin: currentPen.lineJoin,
    };

    set({
      isDrawing: true,
      drawings: {
        ...drawings,
        [currentPage]: [...pageDrawings, newStroke],
      },
    });
  },
  draw: (x, y) => {
    const { isDrawing, drawings, currentPage } = get();
    if (!isDrawing) return;

    const pageDrawings = drawings[currentPage] || [];
    const updatedStrokes = [...pageDrawings];

    if (updatedStrokes.length === 0) return;

    const lastStroke = updatedStrokes[updatedStrokes.length - 1];
    lastStroke.points.push({ x, y });

    set({
      drawings: {
        ...drawings,
        [currentPage]: updatedStrokes,
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
