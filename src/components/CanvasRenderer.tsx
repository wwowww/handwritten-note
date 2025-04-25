import { useRef } from "react";
import useCanvasRenderer from "@/hooks/useCanvasRenderer";

interface CanvasRendererProps {
  file: File | null;
}

const CanvasRenderer = ({ file }: CanvasRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useCanvasRenderer(canvasRef, file);

  return (
    <canvas ref={canvasRef} className="max-w-full h-auto" />
  )
}

export default CanvasRenderer