import { useDrawingStore } from "@/stores/useDrawingStore";


const DrawingActions = () => {
  const { undo, redo, clearPage, history, future, drawings, currentPage } = useDrawingStore();

  const hasDrawingOnPage = (drawings[currentPage]?.length ?? 0) > 0;

  const handleClear = () => {
    if (confirm('정말 지우시겠습니까?')) {
      clearPage();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={undo}
        disabled={history.length === 0 || !hasDrawingOnPage}
        className={`px-4 py-2 rounded ${history.length === 0 || !hasDrawingOnPage
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        <img src="/src/assets/arrow.svg" alt="뒤로가기" className="w-4 h-4" />
      </button>

      <button
        onClick={redo}
        disabled={future.length === 0}
        className={`px-4 py-2 rounded ${future.length === 0
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
      >
        앞으로가기
      </button>

      <button
        onClick={handleClear}
        disabled={!hasDrawingOnPage}
        className={`px-4 py-2 rounded ${!hasDrawingOnPage
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
      >
        전체 삭제
      </button>
    </div>
  );
}

export default DrawingActions