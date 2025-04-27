export enum PenType {
  BALLPOINT = 'ballpoint',
  HIGHLIGHTER = 'highlighter',
}

export interface Pen {
  type: PenType;
  color: string;
  size: number;
  opacity: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
}

export const defaultPen: Pen = {
  type: PenType.BALLPOINT,
  color: '#000000',
  size: 2,
  opacity: 1,
  lineCap: 'round',
  lineJoin: 'round',
};

export const penSettings: Record<PenType, Pen> = {
  [PenType.BALLPOINT]: {
    type: PenType.BALLPOINT,
    color: '#000000',
    size: 2,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
  },
  [PenType.HIGHLIGHTER]: {
    type: PenType.HIGHLIGHTER,
    color: '#FFEB3B',
    size: 10,
    opacity: 0.2,
    lineCap: 'butt',
    lineJoin: 'miter',
  },
};