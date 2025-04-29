import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Pen, PenType, penSettings } from '@/utils/penTypes';

interface Point {
  x: number;
  y: number;
}

export interface Stroke {
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
  history: Record<number, Stroke[]>[];
  future: Record<number, Stroke[]>[];
  triggerRefresh: () => void;
  setPage: (page: number) => void;
  setPen: (pen: Pen) => void;
  startDraw: (x: number, y: number) => void;
  draw: (x: number, y: number) => void;
  stopDraw: () => void;
  resetAll: () => void;
  undo: () => void;
  redo: () => void;
  clearPage: () => void;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  isDrawing: false,
  drawings: {},
  currentPage: 1,
  currentPen: penSettings[PenType.BALLPOINT],
  refreshVersion: 0,
  history: [],
  future: [],
  
  triggerRefresh: () => {
    set((state) => ({ refreshVersion: state.refreshVersion + 1 }));
  },

  setPage: (page) => {
    const previousPage = get().currentPage;
    if (page !== previousPage) {
      set({ currentPage: page });
      get().triggerRefresh();
    }
  },

  setPen: (pen) => {
    set({ currentPen: pen });
  },

  startDraw: (x, y) => {
    const { drawings, currentPage, currentPen, history } = get();
    const currentDrawingsSnapshot = { ...drawings };
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
      history: [...history, currentDrawingsSnapshot],
      future: [],
    });
  },

  draw: (x, y) => {
    const { isDrawing, drawings, currentPage } = get();
    if (!isDrawing) return;

    const pageDrawings = drawings[currentPage] || [];
    if (pageDrawings.length === 0) return;

    const updatedPageDrawings = pageDrawings.map((stroke, index) => {
      if (index === pageDrawings.length - 1) {
        if (stroke.page !== currentPage) {
            console.error(`[draw Error] Mismatch! Store currentPage=${currentPage}, but stroke.page=${stroke.page}`);
            return stroke;
        }
        return {
          ...stroke,
          points: [...stroke.points, { x, y }]
        };
      }
      return stroke;
    });

    set({
      drawings: {
        ...drawings,
        [currentPage]: updatedPageDrawings
      },
    });
  },

  stopDraw: () => {
    set({ isDrawing: false });
  },

  resetAll: () => {
    set({
      drawings: {}, isDrawing: false, history: [], future: [],
      refreshVersion: get().refreshVersion + 1,
    });
  },

  undo: () => {
    const { history, drawings } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    set((state) => ({
      drawings: previous, history: newHistory, future: [drawings, ...state.future],
      refreshVersion: state.refreshVersion + 1,
    }));
  },

  redo: () => {
    const { future, drawings } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set((state) => ({
      drawings: next, history: [...state.history, drawings], future: newFuture,
      refreshVersion: state.refreshVersion + 1,
    }));
  },

  clearPage: () => {
    const { drawings, currentPage, history } = get();
    const currentDrawingsSnapshot = { ...drawings };
    const newDrawings = { ...drawings, [currentPage]: [] };
    set({
      drawings: newDrawings, history: [...history, currentDrawingsSnapshot], future: [],
      refreshVersion: get().refreshVersion + 1,
    });
  },
}));