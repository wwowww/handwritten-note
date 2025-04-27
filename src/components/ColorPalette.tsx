import { colors } from '@/utils/colors';
import { useDrawingStore } from '@/stores/useDrawingStore';

const ColorPalette = () => {
  const { currentPen, setPen } = useDrawingStore();

  const handleColorChange = (color: string) => {
    setPen({ ...currentPen, color });
  };

  return (
    <div className="flex gap-1.5 p-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange(color)}
          className={`w-5 h-5 rounded-full box-border border-[2px] ${currentPen.color === color ? 'border-gray-300' : 'border-gray-100'}`}

          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
