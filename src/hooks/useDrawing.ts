import { useDrawingStore } from '@/stores/useDrawingStore';
import { useEffect } from 'react';

interface Point { x: number; y: number; }
interface Stroke {
  points: Point[];
  color?: string;
  size?: number;
  opacity?: number;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'round' | 'bevel' | 'miter';
  type?: string;
}

const useDrawing = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const { isDrawing, drawings, currentPage, startDraw, draw, stopDraw } = useDrawingStore();
  const strokes: Stroke[] = drawings[currentPage] || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    strokes.forEach((stroke) => {
      ctx.save();
      try {
        if (!stroke || !stroke.points || stroke.points.length < 1) return;

        const isHighlighter = stroke.type === 'highlighter' || (stroke.opacity !== undefined && stroke.opacity < 1 && (stroke.size || 0) > 10);

        ctx.beginPath();
        ctx.lineJoin = stroke.lineJoin || 'round';
        ctx.lineCap = isHighlighter ? 'butt' : (stroke.lineCap || 'round');
        ctx.strokeStyle = stroke.color || '#000000';
        ctx.lineWidth = stroke.size || 2;
        ctx.globalAlpha = stroke.opacity === undefined ? 1 : stroke.opacity;
        ctx.globalCompositeOperation = 'source-over'; // 명시적 설정 추가

        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        if (stroke.points.length === 1) {
          const pointSize = stroke.size || 2;
          ctx.fillStyle = stroke.color || '#000000';
          ctx.fillRect(
            stroke.points[0].x - pointSize / 2,
            stroke.points[0].y - pointSize / 2,
            pointSize,
            pointSize
          );
        } else {
          if (isHighlighter) {
             for (let i = 1; i < stroke.points.length; i++) {
                 ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
             }
          } else {
             for (let i = 1; i < stroke.points.length; i++) {
                 const prev = stroke.points[i - 1];
                 const current = stroke.points[i];
                 const midX = (prev.x + current.x) / 2;
                 const midY = (prev.y + current.y) / 2;
                 ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
             }
          }
          ctx.stroke();
        }
      } finally {
        ctx.restore();
      }
    });

    ctx.restore();

  }, [strokes, currentPage, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      startDraw(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      draw(x, y);
    };

    const handleMouseUpOrLeave = () => {
      if (isDrawing) {
        stopDraw();
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUpOrLeave);
    canvas.addEventListener('mouseleave', handleMouseUpOrLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
      canvas.removeEventListener('mouseleave', handleMouseUpOrLeave);
    };
  }, [canvasRef, isDrawing, startDraw, draw, stopDraw]);
};

export default useDrawing;