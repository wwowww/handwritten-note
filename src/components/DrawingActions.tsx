import { useDrawingStore } from "@/stores/useDrawingStore";
import Bar from "./ui/Bar";


const DrawingActions = () => {
  const { undo, redo, clearPage, history, future, drawings, currentPage } = useDrawingStore();

  const hasDrawingOnPage = (drawings[currentPage]?.length ?? 0) > 0;

  const handleClear = () => {
    if (confirm('필기를 모두 지우시겠습니까?')) {
      clearPage();
    }
  };

  return (
    <div className="flex gap-2 p-2">
      <button
        onClick={redo}
        disabled={future.length === 0}
        className={`${future.length === 0
          ? 'opacity-40 cursor-not-allowed'
          : ''
          }`}
      >
        <img src="/src/assets/arrow.svg" alt="앞으로가기" className="w-5 h-5" />
      </button>
      <button
        onClick={undo}
        disabled={history.length === 0 || !hasDrawingOnPage}
        className={`${history.length === 0 || !hasDrawingOnPage
          ? 'opacity-40 cursor-not-allowed'
          : ''
          }`}
      >
        <img src="/src/assets/arrow.svg" alt="뒤로가기" className="w-5 h-5 transform scale-x-[-1]" />
      </button>
      <Bar />
      <button
        onClick={handleClear}
        disabled={!hasDrawingOnPage}
        className={`${!hasDrawingOnPage
          ? 'opacity-40 cursor-not-allowed'
          : ''
          }`}
      >
        <img src="/src/assets/eraser.png" alt="" className="w-5 h-5" />
      </button>
    </div>
  );
}

export default DrawingActions