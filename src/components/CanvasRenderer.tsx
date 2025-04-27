import { useRef, useEffect } from "react";
import useCanvasRenderer from "@/hooks/useCanvasRenderer";
import { useNoteStore } from "@/stores/useNoteStore";
import useDrawing from "@/hooks/useDrawing";
import { usePdfStore } from "@/stores/usePdfStore";
import { useDrawingStore } from "@/stores/useDrawingStore";
import DownloadButton from "./DownloadButton";
import PageControls from "./PageControls";

const CanvasRenderer = () => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { file, setFile } = useNoteStore();
  const { pageNumber } = usePdfStore();
  const { setPage } = useDrawingStore();

  useEffect(() => {
    const loadDefaultFile = async () => {
      if (!file) {
        try {
          const response = await fetch("/newspaper-template.png");
          const blob = await response.blob();
          const defaultFile = new File([blob], "newspaper-template.png", { type: blob.type });
          setFile(defaultFile);
        } catch (error) {
          console.error("디폴트 파일을 불러오는 데 실패했습니다", error);
        }
      }
    };

    loadDefaultFile();
  }, [file, setFile]);

  useEffect(() => {
    setPage(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    const resizeCanvas = () => {
      const backgroundCanvas = backgroundCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (backgroundCanvas && drawingCanvas) {
        backgroundCanvas.width = backgroundCanvas.clientWidth;
        backgroundCanvas.height = backgroundCanvas.clientHeight;
        drawingCanvas.width = drawingCanvas.clientWidth;
        drawingCanvas.height = drawingCanvas.clientHeight;
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useCanvasRenderer(backgroundCanvasRef, drawingCanvasRef, file);
  useDrawing(drawingCanvasRef);

  return (
    <>
      <div className="relative w-full h-full mx-auto max-h-minus-134 overflow-y-scroll border border-gray-100 rounded">
        <canvas ref={backgroundCanvasRef} className="absolute top-0 left-0 z-0 w-full" />
        <canvas ref={drawingCanvasRef} className="absolute top-0 left-0 z-10 w-full" />
      </div>
      <div className="flex justify-end p-2 relative">
        <PageControls />
        <DownloadButton
          backgroundCanvasRef={backgroundCanvasRef}
          drawingCanvasRef={drawingCanvasRef}
        />
      </div>
    </>
  );
};

export default CanvasRenderer;