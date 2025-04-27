import React from 'react';

interface DownloadButtonProps {
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  drawingCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const DownloadButton = ({ backgroundCanvasRef, drawingCanvasRef }: DownloadButtonProps) => {
  const handleDownload = () => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    if (!backgroundCanvas || !drawingCanvas) return;

    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = backgroundCanvas.width;
    mergedCanvas.height = backgroundCanvas.height;

    const ctx = mergedCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(backgroundCanvas, 0, 0);

    ctx.drawImage(drawingCanvas, 0, 0);

    const link = document.createElement('a');
    link.href = mergedCanvas.toDataURL('image/png');
    link.download = 'note_merged.png';
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
    >
      <img src="/src/assets/download-file.png" alt="다운로드" className="w-5 h-5" />
    </button>
  );
};

export default DownloadButton