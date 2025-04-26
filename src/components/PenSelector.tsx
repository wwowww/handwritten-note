import { useState } from 'react';
import { useDrawingStore } from '@/stores/useDrawingStore';
import { PenType, penSettings } from '@/utils/penTypes';

const PenSelector = () => {
  const { setPen } = useDrawingStore();
  const [selectedPen, setSelectedPen] = useState<PenType>(PenType.BALLPOINT);

  const handlePenChange = (penType: PenType) => {
    setSelectedPen(penType);
    setPen(penSettings[penType]);
  };

  return (
    <div className="fixed top-15 left-1 z-30">
      <button
        className={`${selectedPen === PenType.BALLPOINT ? 'bg-red-400' : 'bg-white'}`}
        onClick={() => handlePenChange(PenType.BALLPOINT)}
      >
        볼펜
      </button>
      <button
        className={`${selectedPen === PenType.HIGHLIGHTER ? 'bg-red-400' : 'bg-white'}`}
        onClick={() => handlePenChange(PenType.HIGHLIGHTER)}
      >
        형광펜
      </button>
    </div>
  );
};

export default PenSelector;