import { usePdfStore } from '@/stores/usePdfStore';

const PageControls = () => {
  const { pageNumber, totalPages, prevPage, nextPage } = usePdfStore();

  return (
    totalPages > 1 &&
    <div className="absolute left-[50%] t-0 translate-x-[-50%] flex items-center gap-2">
      <button onClick={prevPage} disabled={pageNumber <= 1} className="text-sm bg-gray-100 py-1 px-2 cursor-pointer rounded-md text-gray-700">
        이전
      </button>
      <span className='text-sm'>{pageNumber} / {totalPages}</span>
      <button onClick={nextPage} disabled={pageNumber >= totalPages} className="text-sm bg-gray-100 py-1 px-2 cursor-pointer rounded-md text-gray-700">
        다음
      </button>
    </div>
  );
}

export default PageControls