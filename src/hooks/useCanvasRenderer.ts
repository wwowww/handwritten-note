import { useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { usePdfStore } from '@/stores/usePdfStore';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const useCanvasRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  file: File | null
) => {
  const { pageNumber, setTotalPages } = usePdfStore();

  useEffect(() => {
    if (!file || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const url = URL.createObjectURL(file);

    const render = async () => {
      if (file.type === 'application/pdf') {
        const pdf = await getDocument(url).promise;
        setTotalPages(pdf.numPages);

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        await page.render(renderContext).promise;
      } else if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = url;
      }
    };

    render();
    return () => URL.revokeObjectURL(url);
  }, [file, canvasRef, pageNumber, setTotalPages]);
}

export default useCanvasRenderer