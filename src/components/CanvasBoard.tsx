import FileUploader from './FileUploader'
import CanvasRenderer from './CanvasRenderer'
import PageControls from './PageControls'
import PenSelector from './PenSelector'

const CanvasBoard = () => {
  return (
    <>
      <FileUploader />
      <CanvasRenderer />
      <PageControls />
      <PenSelector />
    </>
  )
}

export default CanvasBoard