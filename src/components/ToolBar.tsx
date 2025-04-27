import FileUploader from '@components/FileUploader';
import PenSelector from '@components/PenSelector';
import DrawingActions from '@components/DrawingActions';
import ColorPalette from '@components/ColorPalette';
import Bar from './ui/Bar';

const ToolBar = () => {
  return (
    <div className='flex justify-between items-center p-2'>
      <div className='flex items-center'>
        <FileUploader />
        <Bar />
        <ColorPalette />
        <Bar />
        <PenSelector />
      </div>
      <DrawingActions />
    </div>
  )
}

export default ToolBar