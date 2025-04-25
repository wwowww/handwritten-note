import { useRef } from "react";
import useCanvasRenderer from "@/hooks/useCanvasRenderer";
import { useNoteStore } from "@/stores/useNoteStore";

const CanvasRenderer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { file } = useNoteStore();

  useCanvasRenderer(canvasRef, file);

  return (
    <canvas ref={canvasRef} className="max-w-full h-auto" />
  )
}

export default CanvasRenderer