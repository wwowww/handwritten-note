import React from 'react';
import jsPDF from 'jspdf';

interface DownloadButtonProps {
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  drawingCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const DownloadButton = ({ backgroundCanvasRef, drawingCanvasRef }: DownloadButtonProps) => {
  const handleDownload = () => {
    const backgroundCanvas = backgroundCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    if (!backgroundCanvas || !drawingCanvas) return;

    try {
      const mergedCanvas = document.createElement('canvas');
      mergedCanvas.width = backgroundCanvas.width;
      mergedCanvas.height = backgroundCanvas.height;
      const ctx = mergedCanvas.getContext('2d');
      if (!ctx) throw new Error("병합 캔버스 컨텍스트 생성 실패");

      ctx.drawImage(backgroundCanvas, 0, 0);
      ctx.drawImage(drawingCanvas, 0, 0);

      const imgData = mergedCanvas.toDataURL('image/png');

      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = backgroundCanvas.width / dpr;
      const logicalHeight = backgroundCanvas.height / dpr;
      const orientation = logicalWidth >= logicalHeight ? 'l' : 'p';

      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = logicalWidth / logicalHeight;
      let imgPdfWidth = pdfWidth;
      let imgPdfHeight = pdfWidth / ratio;

      if (imgPdfHeight > pdfHeight) {
        imgPdfHeight = pdfHeight;
        imgPdfWidth = pdfHeight * ratio;
      }

      const xOffset = (pdfWidth - imgPdfWidth) / 2;
      const yOffset = (pdfHeight - imgPdfHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgPdfWidth, imgPdfHeight);
      pdf.save('note_merged.pdf');

    } catch (error) {
      console.error("PDF 생성 또는 저장 실패:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
    >
      <img src="/download-file.png" alt="다운로드" className="w-5 h-5" />
    </button>
  );
};

export default DownloadButton