import { useRef } from "react";
import useCanvasRenderer from "@/hooks/useCanvasRenderer";
import { useNoteStore } from "@/stores/useNoteStore";
import useDrawing from "@/hooks/useDrawing";

const CanvasRenderer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { file } = useNoteStore();

  useCanvasRenderer(canvasRef, file);
  useDrawing(canvasRef);

  return (
    <canvas ref={canvasRef} className="max-w-full h-auto" />
  )
}

export default CanvasRenderer