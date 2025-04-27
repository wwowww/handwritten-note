import { useDrawingStore } from '@/stores/useDrawingStore';
import { useEffect } from 'react';

const useDrawing = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const { isDrawing, drawings, currentPage, startDraw, draw, stopDraw, refreshVersion } = useDrawingStore();
  const strokes = drawings[currentPage] || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.lineJoin = stroke.lineJoin;
      ctx.lineCap = stroke.lineCap;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.globalAlpha = stroke.opacity;

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1];
        const current = stroke.points[i];
    
        const midX = (prev.x + current.x) / 2;
        const midY = (prev.y + current.y) / 2;
    
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.stroke();
    });
  }, [strokes, currentPage, refreshVersion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      startDraw((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      draw((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    };

    const handleMouseUp = () => stopDraw();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, isDrawing, startDraw, draw, stopDraw]);
};

export default useDrawing;
