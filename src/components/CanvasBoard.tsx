import FileUploader from './FileUploader'
import CanvasRenderer from './CanvasRenderer'
import PageControls from './PageControls'
import PenSelector from './PenSelector'
import ColorPalette from './ColorPalette'

const CanvasBoard = () => {
  return (
    <>
      <FileUploader />
      <ColorPalette />
      <PenSelector />
      <CanvasRenderer />
      <PageControls />
    </>
  )
}

export default CanvasBoard