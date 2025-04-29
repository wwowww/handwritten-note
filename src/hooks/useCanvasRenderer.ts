import { useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { usePdfStore } from '@/stores/usePdfStore';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const useCanvasRenderer = (
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  drawingCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  file: File | null
) => {
  const { pageNumber, totalPages, setTotalPages, setPage } = usePdfStore();

  useEffect(() => {
    if (!file || !backgroundCanvasRef.current || !drawingCanvasRef.current) return;

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

        const isPDF = file.type === 'application/pdf';

        if (!isPDF) {
          console.warn('지원하지 않는 파일 형식입니다.');
          bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          const drawCtx = drawCanvas.getContext('2d');
          drawCtx?.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          return;
        }

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
  }, [file, pageNumber, backgroundCanvasRef, drawingCanvasRef, setTotalPages, totalPages, setPage]);
};

export default useCanvasRenderer;