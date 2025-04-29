import { useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { usePdfStore } from '@/stores/usePdfStore';
import { useDrawingStore } from '@/stores/useDrawingStore';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const useCanvasRenderer = (
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  drawingCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  file: File | null
) => {
  const { pageNumber, totalPages, setTotalPages, setPage } = usePdfStore();
  const { triggerRefresh } = useDrawingStore();

  useEffect(() => {
    if (!file || file.type !== 'application/pdf' || !backgroundCanvasRef.current || !drawingCanvasRef.current) {
      const bgCanvas = backgroundCanvasRef.current;
      const drawCanvas = drawingCanvasRef.current;
      if(bgCanvas) bgCanvas.getContext('2d')?.clearRect(0,0,bgCanvas.width, bgCanvas.height);
      if(drawCanvas) drawCanvas.getContext('2d')?.clearRect(0,0,drawCanvas.width, drawCanvas.height);
      if (!file && totalPages !== 1) {
          setTotalPages(1);
          if (pageNumber !== 1) setPage(1);
      }
      return;
    };

    const bgCanvas = backgroundCanvasRef.current;
    const drawCanvas = drawingCanvasRef.current;
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) return;

    let isMounted = true;

    const render = async () => {
      try {
        const dpr = window.devicePixelRatio || 1;
        const maxWidthPx = 800;

        let baseWidth = bgCanvas.clientWidth;
        let baseHeight = bgCanvas.clientHeight;
        let displayWidth = baseWidth;
        let displayHeight = baseHeight;

        const pdfData = await file.arrayBuffer();
        const pdf = await getDocument(pdfData).promise;
        if (!isMounted) return;

        if (totalPages !== pdf.numPages) setTotalPages(pdf.numPages);

        const validPageNumber = Math.max(1, Math.min(pageNumber, pdf.numPages));
        if (validPageNumber !== pageNumber) {
          setPage(validPageNumber);
          return;
        }

        const page = await pdf.getPage(validPageNumber);
        const baseViewport = page.getViewport({ scale: 1.5 });
        baseWidth = baseViewport.width;
        baseHeight = baseViewport.height;

        const aspectRatio = baseWidth / baseHeight;
        displayWidth = Math.min(baseWidth, maxWidthPx);
        displayHeight = displayWidth / aspectRatio;

        bgCanvas.width = displayWidth * dpr;
        bgCanvas.height = displayHeight * dpr;
        bgCanvas.style.width = `${displayWidth}px`;
        bgCanvas.style.height = `${displayHeight}px`;

        drawCanvas.width = displayWidth * dpr;
        drawCanvas.height = displayHeight * dpr;
        drawCanvas.style.width = `${displayWidth}px`;
        drawCanvas.style.height = `${displayHeight}px`;

        const renderScale = displayWidth / baseViewport.width * baseViewport.scale;
        const renderViewport = page.getViewport({ scale: renderScale });

        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.save();
        bgCtx.scale(dpr, dpr);
        await page.render({ canvasContext: bgCtx, viewport: renderViewport }).promise;
        bgCtx.restore();

        if (isMounted) triggerRefresh();
      } catch (error) {
        console.error("캔버스 렌더링 실패:", error);
        if (bgCtx && bgCanvas) {
          bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          const drawCtx = drawCanvas.getContext('2d');
          drawCtx?.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        }
      }
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [file, pageNumber, backgroundCanvasRef, drawingCanvasRef, setTotalPages, totalPages, setPage, triggerRefresh]);

};

export default useCanvasRenderer;