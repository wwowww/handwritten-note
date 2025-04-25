import { useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

export default function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  file: File | null
) {
  useEffect(() => {
    if (!file || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const url = URL.createObjectURL(file);

    const render = async () => {
      try {
        if (file.type === 'application/pdf') {
          const pdf = await getDocument(url).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
        } else if (file.type.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
          img.onerror = () => {
            console.error('이미지 로딩 실패');
          };
          img.src = url;
        }
      } catch (e) {
        console.error('렌더링 오류:', e);
      }
    };

    render();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);
}
