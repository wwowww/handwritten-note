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
  const { pageNumber, setTotalPages } = usePdfStore();
  const { setPage, triggerRefresh } = useDrawingStore();

  useEffect(() => {
    if (!file || !backgroundCanvasRef.current) return;

    const bgCanvas = backgroundCanvasRef.current;
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) return;

    const url = URL.createObjectURL(file);

    const render = async () => {
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');

      if (!isPDF && !isImage) return;

      setPage(pageNumber);

      if (isPDF) {
        const pdf = await getDocument(url).promise;
        setTotalPages(pdf.numPages);

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });

        bgCanvas.width = viewport.width;
        bgCanvas.height = viewport.height;

        if (drawingCanvasRef.current) {
          drawingCanvasRef.current.width = viewport.width;
          drawingCanvasRef.current.height = viewport.height;
        }

        await page.render({ canvasContext: bgCtx, viewport }).promise;
      }

      if (isImage) {
        const img = new Image();
        img.onload = () => {
          bgCanvas.width = img.width;
          bgCanvas.height = img.height;

          if (drawingCanvasRef.current) {
            drawingCanvasRef.current.width = img.width;
            drawingCanvasRef.current.height = img.height;
          }

          bgCtx.drawImage(img, 0, 0);
        };
        img.src = url;
      }

      triggerRefresh();
    };

    render();
    return () => URL.revokeObjectURL(url);
  }, [file, pageNumber, backgroundCanvasRef, drawingCanvasRef]);
};

export default useCanvasRenderer;
