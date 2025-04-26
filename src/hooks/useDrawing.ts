import { useDrawingStore } from '@/stores/useDrawingStore';
import { useEffect } from 'react';

const useDrawing = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const { isDrawing, drawings, currentPage, startDraw, draw, stopDraw, currentPen, refreshVersion } = useDrawingStore();
  const pointsGroups = drawings[currentPage] || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentPen.color;
    ctx.lineWidth = currentPen.size;
    ctx.globalAlpha = currentPen.opacity;

    pointsGroups.forEach((points) => {
      if (points.length < 2) return;
      ctx.beginPath();
      for (let i = 1; i < points.length; i++) {
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    });
  }, [pointsGroups, currentPage, refreshVersion, currentPen]);

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
