import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Pen, PenType, penSettings } from '@/utils/penTypes';

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
    set({ currentPage: page });
  },

  setPen: (pen) => {
    set({ currentPen: pen });
  },

  startDraw: (x, y) => {
    const { drawings, currentPage, currentPen, history } = get();
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
      history: [...history, { ...drawings }],
      future: [],
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
    set({ 
      drawings: {}, 
      isDrawing: false, 
      history: [], 
      future: [] 
    });
  },

  undo: () => {
    const { history, drawings } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);

    set((state) => ({
      drawings: previous,
      history: newHistory,
      future: [state.drawings, ...state.future],
      refreshVersion: state.refreshVersion + 1,
    }));
  },

  redo: () => {
    const { future, drawings } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set((state) => ({
      drawings: next,
      history: [...state.history, state.drawings],
      future: newFuture,
      refreshVersion: state.refreshVersion + 1,
    }));
  },

  clearPage: () => {
    const { drawings, currentPage, history } = get();
    const newDrawings = { ...drawings, [currentPage]: [] };

    set({
      drawings: newDrawings,
      history: [...history, { ...drawings }],
      future: [],
      refreshVersion: get().refreshVersion + 1,
    });
  },
}));
