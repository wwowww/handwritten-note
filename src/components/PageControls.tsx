import { usePdfStore } from '@/stores/usePdfStore';

const PageControls = () => {
  const { pageNumber, totalPages, prevPage, nextPage } = usePdfStore();

  const isPrevDisabled = pageNumber <= 1;
  const isNextDisabled = pageNumber >= totalPages;

  return (
    totalPages > 1 &&
    <div className="absolute left-[50%] t-0 translate-x-[-50%] flex items-center gap-2">
      <button
        onClick={prevPage}
        disabled={isPrevDisabled}
        className={`
          text-sm bg-gray-100 py-1 px-2 rounded-md text-gray-700
          ${isPrevDisabled
            ? 'opacity-70 cursor-not-allowed'
            : 'cursor-pointer hover:bg-gray-300'
          }
        `}
      >
        이전
      </button>
      <span className='text-sm'>{pageNumber} / {totalPages}</span>
      <button
        onClick={nextPage}
        disabled={isNextDisabled}
        className={`
          text-sm bg-gray-100 py-1 px-2 rounded-md text-gray-700
          ${isNextDisabled
            ? 'opacity-70 cursor-not-allowed'
            : 'cursor-pointer hover:bg-gray-300'
          }
        `}
      >
        다음
      </button>
    </div>
  );
}

export default PageControls;