import { colors } from '@/utils/colors';
import { useDrawingStore } from '@/stores/useDrawingStore';

const ColorPalette = () => {
  const { currentPen, setPen } = useDrawingStore();

  const handleColorChange = (color: string) => {
    setPen({ ...currentPen, color });
  };

  return (
    <div className="flex gap-2 p-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange(color)}
          className={`w-8 h-8 rounded-full border-2 ${currentPen.color === color ? 'border-black' : 'border-gray-300'
            }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
