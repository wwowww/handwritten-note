import { useRef, useEffect } from "react";
import useCanvasRenderer from "@/hooks/useCanvasRenderer";
import { useNoteStore } from "@/stores/useNoteStore";
import useDrawing from "@/hooks/useDrawing";
import DownloadButton from "./DownloadButton";
import PageControls from "./PageControls";

const CanvasRenderer = () => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { file, setFile } = useNoteStore();

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

  useCanvasRenderer(backgroundCanvasRef, drawingCanvasRef, file);
  useDrawing(drawingCanvasRef);

  return (
    <>
      <div className="relative w-full h-full mx-auto max-h-minus-134 overflow-y-scroll border border-gray-100 rounded">
        <canvas
          ref={backgroundCanvasRef}
          className="absolute top-0 left-0 z-0 block"
        />
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-0 left-0 z-10 block"
        />
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