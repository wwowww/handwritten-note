import { useState } from 'react';
import { useDrawingStore } from '@/stores/useDrawingStore';
import { PenType, penSettings } from '@/utils/penTypes';

const penTypeImageMap: Record<PenType, string> = {
  [PenType.BALLPOINT]: '/src/assets/ball-point.png',
  [PenType.HIGHLIGHTER]: '/src/assets/marker-pen.png',
};

const PenSelector = () => {
  const { setPen } = useDrawingStore();
  const [selectedPen, setSelectedPen] = useState<PenType>(PenType.BALLPOINT);

  const handlePenChange = (penType: PenType) => {
    setSelectedPen(penType);
    setPen(penSettings[penType]);
  };

  return (
    <div className='flex gap-1 p-2'>
      {Object.values(PenType).map((penType) => (
        <button
          key={penType}
          onClick={() => handlePenChange(penType)}
        >
          <img
            src={penTypeImageMap[penType]}
            alt={penType}
            className={`${selectedPen === penType ? '' : 'opacity-60'} w-5 h-5 relative`}
          />
        </button>
      ))}
    </div>
  );
};

export default PenSelector;