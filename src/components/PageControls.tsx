import { usePdfStore } from '@/stores/usePdfStore';

const PageControls = () => {
  const { pageNumber, totalPages, prevPage, nextPage } = usePdfStore();

  return (
    totalPages > 1 &&
    <div className="flex items-center gap-4 justify-center my-4">
      <button onClick={prevPage} disabled={pageNumber <= 1} className="px-3 py-1 bg-gray-200 rounded">
        이전
      </button>
      <span>{pageNumber} / {totalPages}</span>
      <button onClick={nextPage} disabled={pageNumber >= totalPages} className="px-3 py-1 bg-gray-200 rounded">
        다음
      </button>
    </div>
  );
}

export default PageControls