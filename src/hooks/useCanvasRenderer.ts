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
        let baseWidth = bgCanvas.clientWidth;
        let baseHeight = bgCanvas.clientHeight;

        const isPDF = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');

        if (!isPDF && !isImage) {
          console.warn('지원하지 않는 파일 형식입니다.');
          bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          const drawCtx = drawCanvas.getContext('2d');
          drawCtx?.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          return;
        }

        if (isPDF) {
          const pdfData = await file.arrayBuffer();
          const pdf = await getDocument(pdfData).promise;

          if (!isMounted) return;

          if (totalPages !== pdf.numPages) {
            setTotalPages(pdf.numPages);
          }

          const validPageNumber = Math.max(1, Math.min(pageNumber, pdf.numPages));
          if (validPageNumber !== pageNumber) {
            setPage(validPageNumber);
            return;
          }

          const page = await pdf.getPage(validPageNumber);
          const viewport = page.getViewport({ scale: 1.5 });

          baseWidth = viewport.width;
          baseHeight = viewport.height;

          bgCanvas.width = baseWidth * dpr;
          bgCanvas.height = baseHeight * dpr;
          bgCanvas.style.width = `${baseWidth}px`;
          bgCanvas.style.height = `${baseHeight}px`;

          drawCanvas.width = baseWidth * dpr;
          drawCanvas.height = baseHeight * dpr;
          drawCanvas.style.width = `${baseWidth}px`;
          drawCanvas.style.height = `${baseHeight}px`;

          bgCtx.save();
          bgCtx.scale(dpr, dpr);
          await page.render({ canvasContext: bgCtx, viewport }).promise;
          bgCtx.restore();

        } else if (isImage) {
          const url = URL.createObjectURL(file);
          const img = new Image();

          img.onload = () => {
            if (!isMounted) { URL.revokeObjectURL(url); return; }

            if (totalPages !== 1) setTotalPages(1);
            if (pageNumber !== 1) setPage(1);

            baseWidth = img.width;
            baseHeight = img.height;

            bgCanvas.width = baseWidth * dpr;
            bgCanvas.height = baseHeight * dpr;
            bgCanvas.style.width = `${baseWidth}px`;
            bgCanvas.style.height = `${baseHeight}px`;

            drawCanvas.width = baseWidth * dpr;
            drawCanvas.height = baseHeight * dpr;
            drawCanvas.style.width = `${baseWidth}px`;
            drawCanvas.style.height = `${baseHeight}px`;

            bgCtx.save();
            bgCtx.scale(dpr, dpr);
            bgCtx.drawImage(img, 0, 0, baseWidth, baseHeight);
            bgCtx.restore();

            URL.revokeObjectURL(url);
          };

          img.onerror = () => {
            console.error("이미지 로드 실패");
            if(isMounted) URL.revokeObjectURL(url);
          }
          img.src = url;
        }
      } catch (error) {
        console.error("캔버스 렌더링 실패:", error);
      }
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [file, pageNumber, backgroundCanvasRef, drawingCanvasRef, setTotalPages, totalPages, setPage]);
};

export default useCanvasRenderer;