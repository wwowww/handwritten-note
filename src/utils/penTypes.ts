export enum PenType {
  BALLPOINT = 'ballpoint',
  HIGHLIGHTER = 'highlighter',
}

export interface Pen {
  type: PenType;
  color: string;
  size: number;
  opacity: number;
}

export const defaultPen: Pen = {
  type: PenType.BALLPOINT,
  color: '#000000',
  size: 2,
  opacity: 1,
};

export const penSettings: Record<PenType, Pen> = {
  [PenType.BALLPOINT]: {
    type: PenType.BALLPOINT,
    color: '#000000',
    size: 2,
    opacity: 1,
  },
  [PenType.HIGHLIGHTER]: {
    type: PenType.HIGHLIGHTER,
    color: '#FFEB3B',
    size: 8,
    opacity: 0.5,
  },
};